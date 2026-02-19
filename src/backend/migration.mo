import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Time "mo:core/Time";

module {
  type OldCoinType = {
    #icp;
    #infinityCoin;
  };

  type OldTransactionHistoryItem = {
    id : Nat;
    recipient : Text;
    amountE8 : Nat;
    coinType : OldCoinType;
    sender : Principal;
    timestamp : Time.Time;
  };

  type OldContact = {
    id : Nat;
    name : Text;
    address : Text;
    owner : Principal;
  };

  type OldActor = {
    transactionCounter : Nat;
    contactCounter : Nat;
    balancesVault : Map.Map<Principal, (Nat, Nat)>;
    userProfiles : Map.Map<Principal, { name : Text }>;
    transactionHistory : List.List<OldTransactionHistoryItem>;
    contacts : List.List<OldContact>;
  };

  type NewCoinType = {
    #icp;
    #ckBtc;
    #ckEth;
    #ckSol;
    #infinityCoin;
  };

  type NewTransactionHistoryItem = {
    id : Nat;
    recipient : Text;
    amountE8 : Nat;
    coinType : NewCoinType;
    sender : Principal;
    timestamp : Time.Time;
  };

  type NewActor = {
    transactionCounter : Nat;
    contactCounter : Nat;
    balancesVault : Map.Map<Principal, (Nat, Nat, Nat, Nat, Nat)>;
    userProfiles : Map.Map<Principal, { name : Text }>;
    transactionHistory : List.List<NewTransactionHistoryItem>;
    contacts : List.List<OldContact>;
  };

  public func run(old : OldActor) : NewActor {
    let newBalancesVault = Map.empty<Principal, (Nat, Nat, Nat, Nat, Nat)>();
    for (
      (principal, (icp, infinityCoin)) in old.balancesVault.entries()
    ) {
      newBalancesVault.add(principal, (icp, 0, 0, 0, infinityCoin));
    };

    let newTransactionHistory = old.transactionHistory.map<OldTransactionHistoryItem, NewTransactionHistoryItem>(
      func(oldTx) {
        {
          oldTx with
          coinType = switch (oldTx.coinType) {
            case (#icp) { #icp };
            case (#infinityCoin) { #infinityCoin };
          };
        };
      }
    );

    {
      old with
      balancesVault = newBalancesVault;
      transactionHistory = newTransactionHistory;
    };
  };
};
