import PocketBase from "pocketbase";

async function getAuthData(provider = "google") {
  const pb = new PocketBase("https://quizzable.trevord.live");

  // get all auth providers
  const providers = await pb.collection("users").listAuthMethods();

  // get a specific auth provider
  if (!providers) {
    console.warn("No auth providers found");
    return null;
  }

  const providerData = providers.authProviders?.find(
    (p) => p.name === provider
  );

  if (!providerData) {
    console.warn(`No auth provider found for ${provider}`);
    return null;
  }

  return providerData;
}

export { getAuthData };
