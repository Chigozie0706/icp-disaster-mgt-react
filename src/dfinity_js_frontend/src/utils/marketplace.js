import { Principal } from "@dfinity/principal";
import { transferICP } from "./ledger";

export async function createGymProfile(gym) {
  return window.canister.marketplace.createGymProfile(gym);
}

export async function getAllGyms() {

  try {
    const result = await window.canister.marketplace.getAllGym();
    console.log("Result:", result);
    return result;
  } catch (err) {
    // Log the error for debugging
    console.error("Error fetching gyms:", err);

    // Handle specific error cases based on their properties
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      // Logout user if there's a specific HTTP response error
      await authClient.logout();
    }
    // Return an empty array in case of error
    return [];
  }

}



export async function getGymById(id) {
  try {
    return await window.canister.marketplace.getGymById(id);
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}


export async function getAllEnrollesByGymId(id) {
  try {
    return await window.canister.marketplace.getAllEnrollesByGymId(id);
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}

export async function getAllServicesById(id) {
  try {
    return await window.canister.marketplace.getAllServicesById(id);
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}


export async function gymMembershipRegistration(payload) {
  return window.canister.marketplace.gymMembershipRegistration(payload);
}

export async function addGymService(payload) {
  return window.canister.marketplace.addGymService(payload);
}


export async function updateGymById(id, payload) {
  return window.canister.marketplace.updateGymById(id, payload);
}

export async function deleteGymById(id) {
  return window.canister.marketplace.deleteGymById(id);
}


export async function buyProduct(product) {
  const marketplaceCanister = window.canister.marketplace;
  const orderResponse = await marketplaceCanister.createOrder(product.id);
  const sellerPrincipal = Principal.from(orderResponse.Ok.seller);
  const sellerAddress = await marketplaceCanister.getAddressFromPrincipal(sellerPrincipal);
  const block = await transferICP(sellerAddress, orderResponse.Ok.price, orderResponse.Ok.memo);
  await marketplaceCanister.completePurchase(sellerPrincipal, product.id, orderResponse.Ok.price, block, orderResponse.Ok.memo);
}
