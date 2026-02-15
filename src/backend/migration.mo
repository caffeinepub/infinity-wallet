import Time "mo:core/Time";
import Principal "mo:core/Principal";
import List "mo:core/List";
import Map "mo:core/Map";

module {
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

  public type Contact = {
    id : Nat;
    name : Text;
    address : Text;
    owner : Principal;
  };

  public type UserProfile = {
    name : Text;
  };

  type OldActor = {
    transactionCounter : Nat;
    contactCounter : Nat;
    balancesVault : Map.Map<Principal, (Nat, Nat)>;
    userProfiles : Map.Map<Principal, UserProfile>;
    transactionHistory : List.List<TransactionHistoryItem>;
    contacts : List.List<Contact>;
  };

  type NewActor = {
    transactionCounter : Nat;
    contactCounter : Nat;
    balancesVault : Map.Map<Principal, (Nat, Nat)>;
    userProfiles : Map.Map<Principal, UserProfile>;
    transactionHistory : List.List<TransactionHistoryItem>;
    contacts : List.List<Contact>;
  };

  public func run(old : OldActor) : NewActor {
    old;
  };
};
