import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Nat32 "mo:core/Nat32";
import List "mo:core/List";
import Order "mo:core/Order";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";



actor {
  type CoinType = {
    #icp;
    #infinityCoin;
  };

  type TransactionHistoryItem = {
    id : Nat;
    recipient : Text;
    amountE8 : Nat;
    coinType : CoinType;
    sender : Principal;
    timestamp : Time.Time;
  };

  module TransactionHistoryItem {
    public func compareByTimestampAscending(a : TransactionHistoryItem, b : TransactionHistoryItem) : Order.Order {
      Nat32.compare(Nat32.fromNat(Int.abs(a.timestamp)), Nat32.fromNat(Int.abs(b.timestamp)));
    };
  };

  public type Contact = {
    id : Nat;
    name : Text;
    address : Text;
    owner : Principal;
  };

  module Contact {
    public func compareById(a : Contact, b : Contact) : Order.Order {
      Nat32.compare(Nat32.fromNat(a.id), Nat32.fromNat(b.id));
    };
  };

  public type UserProfile = {
    name : Text;
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  var transactionCounter = 0;
  var contactCounter = 0;
  let balancesVault = Map.empty<Principal, (Nat, Nat)>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  let transactionHistory = List.empty<TransactionHistoryItem>();
  let contacts = List.empty<Contact>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func recordTransaction(recipient : Text, amountE8 : Nat, coinType : CoinType) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can record transactions");
    };

    transactionCounter += 1;
    let newTransaction : TransactionHistoryItem = {
      id = transactionCounter;
      recipient;
      amountE8;
      coinType;
      sender = caller;
      timestamp = Time.now();
    };
    transactionHistory.add(newTransaction);
  };

  public query ({ caller }) func getTransactionHistory() : async [TransactionHistoryItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view transaction history");
    };

    let userTransactions = transactionHistory.filter(
      func(tx : TransactionHistoryItem) : Bool {
        tx.sender == caller;
      }
    );
    userTransactions.toArray();
  };

  public shared ({ caller }) func saveContact(name : Text, address : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save contacts");
    };

    contactCounter += 1;
    let newContact : Contact = {
      id = contactCounter;
      name;
      address;
      owner = caller;
    };
    contacts.add(newContact);
  };

  public shared ({ caller }) func updateContact(contactId : Nat, name : Text, address : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update contacts");
    };

    let contactToUpdate = contacts.find(
      func(contact : Contact) : Bool {
        contact.id == contactId;
      }
    );

    switch (contactToUpdate) {
      case (null) {
        Runtime.trap("Contact not found");
      };
      case (?contact) {
        if (contact.owner != caller) {
          Runtime.trap("Unauthorized: Can only update your own contacts");
        };
      };
    };

    let reversedContacts = List.empty<Contact>();

    while (not contacts.isEmpty()) {
      switch (contacts.removeLast()) {
        case (null) { };
        case (?contact) {
          if (contact.id == contactId and contact.owner == caller) {
            reversedContacts.add({
              id = contact.id;
              name;
              address;
              owner = contact.owner;
            });
          } else {
            reversedContacts.add(contact);
          };
        };
      };
    };

    contacts.clear();
    while (not reversedContacts.isEmpty()) {
      switch (reversedContacts.removeLast()) {
        case (null) { };
        case (?contact) { contacts.add(contact) };
      };
    };
  };

  public shared ({ caller }) func deleteContact(contactId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete contacts");
    };

    let contactToDelete = contacts.find(
      func(contact : Contact) : Bool {
        contact.id == contactId;
      }
    );

    switch (contactToDelete) {
      case (null) {
        Runtime.trap("Contact not found");
      };
      case (?contact) {
        if (contact.owner != caller) {
          Runtime.trap("Unauthorized: Can only delete your own contacts");
        };
      };
    };

    let filteredContacts = contacts.filter(
      func(contact : Contact) : Bool {
        contact.id != contactId or contact.owner != caller;
      }
    );
    contacts.clear();
    contacts.addAll(filteredContacts.values());
  };

  public query ({ caller }) func getContacts() : async [Contact] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view contacts");
    };

    let userContacts = contacts.filter(
      func(contact : Contact) : Bool {
        contact.owner == caller;
      }
    );
    userContacts.toArray();
  };

  public shared ({ caller }) func recordBalance(coinType : CoinType, balance : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can record balances");
    };

    switch (balancesVault.get(caller)) {
      case (null) {
        switch (coinType) {
          case (#icp) { balancesVault.add(caller, (balance, 0)) };
          case (#infinityCoin) { balancesVault.add(caller, (0, balance)) };
        };
      };
      case (?currentBalances) {
        switch (coinType) {
          case (#icp) {
            balancesVault.add(caller, (balance, currentBalances.1));
          };
          case (#infinityCoin) {
            balancesVault.add(caller, (currentBalances.0, balance));
          };
        };
      };
    };
  };

  public query ({ caller }) func getBalances() : async (Nat, Nat) {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view balances");
    };

    switch (balancesVault.get(caller)) {
      case (null) { (0, 0) };
      case (?balances) { balances };
    };
  };
};
