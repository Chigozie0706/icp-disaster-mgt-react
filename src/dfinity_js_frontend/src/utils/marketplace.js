import { Principal } from "@dfinity/principal";
import { transferICP } from "./ledger";

export async function createDisasterReport(report) {
  return window.canister.marketplace.createDisasterReport(report);
}

export async function getAllDisasterReports() {
  try {
    const result = await window.canister.marketplace.getAllDisasterReports();
    console.log("Result:", result);
    return result;
  } catch (err) {
    console.error("Error fetching disaster reports:", err);
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}

export async function getDisasterReportById(id) {
  try {
    return await window.canister.marketplace.getDisasterReportById(id);
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}

export async function addDisasterImages(payload) {
  return window.canister.marketplace.addDisasterImages(payload);
}

export async function updateDisasterReportById(id, payload) {
  return window.canister.marketplace.updateDisasterReportById(id, payload);
}

export async function deleteDisasterImageById(payload) {
  return window.canister.marketplace.deleteDisasterImageById(payload);
}

// export async function purchaseAidProduct(product) {
//   const marketplaceCanister = window.canister.marketplace;
//   const orderResponse = await marketplaceCanister.createOrder(product.id);
//   const sellerPrincipal = Principal.from(orderResponse.Ok.seller);
//   const sellerAddress = await marketplaceCanister.getAddressFromPrincipal(
//     sellerPrincipal
//   );
//   const block = await transferICP(
//     sellerAddress,
//     orderResponse.Ok.price,
//     orderResponse.Ok.memo
//   );
//   await marketplaceCanister.completePurchase(
//     sellerPrincipal,
//     product.id,
//     orderResponse.Ok.price,
//     block,
//     orderResponse.Ok.memo
//   );
// }
