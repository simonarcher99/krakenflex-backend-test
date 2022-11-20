import { handler } from "./handler";

const checkForApiKeyAndRunHandler = async () => {
    const API_KEY = process.env.API_KEY;
    if (!API_KEY) {
        console.error("API_KEY environment variable must be set")
        return
    }
    await handler("norwich-pear-tree", 3)
    console.log("Successfully processed outages")
}

checkForApiKeyAndRunHandler()

