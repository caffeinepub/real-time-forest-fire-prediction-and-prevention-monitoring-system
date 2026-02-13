import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Order "mo:core/Order";

actor {
  // Officer type definition
  type Officer = {
    name : Text;
    mobileNumber : Text;
  };

  // Helper to compare officers by name
  module Officer {
    public func compare(officer1 : Officer, officer2 : Officer) : Order.Order {
      Text.compare(officer1.name, officer2.name);
    };
  };

  // Officer map persistent throughout the actor's lifecycle
  let officersMap = Map.empty<Text, Officer>();
  let adminsMap = Map.empty<Principal, Bool>();

  /// Register caller as admin if no admin exists.
  public shared ({ caller }) func registerAsAdmin() : async () {
    if (adminsMap.size() == 0) {
      adminsMap.add(caller, true);
    } else {
      Runtime.trap("Admins already exist. Only the first caller can self-register as admin.");
    };
  };

  /// Check if caller is admin.
  func checkAdmin(caller : Principal) {
    if (not adminsMap.containsKey(caller)) {
      Runtime.trap("Only admin can perform this operation.");
    };
  };

  // Add or update officer (admin only)
  public shared ({ caller }) func addOrUpdateOfficer(name : Text, mobileNumber : Text) : async () {
    checkAdmin(caller);
    let officer : Officer = {
      name;
      mobileNumber;
    };
    officersMap.add(name, officer);
  };

  // Remove officer (admin only)
  public shared ({ caller }) func removeOfficer(name : Text) : async () {
    checkAdmin(caller);
    let existed = officersMap.containsKey(name);
    officersMap.remove(name);
    if (not existed) { Runtime.trap("Officer with name " # name # " does not exist.") };
  };

  // Get sorted list of officers
  public query ({ caller }) func getOfficers() : async [Officer] {
    officersMap.values().toArray().sort();
  };

  // Get message payload for an officer
  public query ({ caller }) func getMessagePayload(officerName : Text, message : Text) : async {
    mobileNumber : Text;
    message : Text;
  } {
    switch (officersMap.get(officerName)) {
      case (null) { Runtime.trap("Officer not found. Could not generate message payload.") };
      case (?officer) {
        {
          mobileNumber = officer.mobileNumber;
          message;
        };
      };
    };
  };

  // Initialize admin (for bootstrap purposes)
  public shared ({ caller }) func initAdmin() : async () {
    adminsMap.add(caller, true);
  };

  // Check if a principal is an admin
  public query ({ caller }) func isAdmin(principal : Principal) : async Bool {
    adminsMap.containsKey(principal);
  };
};
