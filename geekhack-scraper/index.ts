import db from "../database/initdb";
import { GrabGHGroupBuyLinks, GroupBuyPage } from "./grabGHGroupBuyLinks";
import threadscrape from "./threadscrape";
import { SaveToDatabase } from "./saveToDatabase";
import { GroupBuyURL, InterestCheckURL } from "../utils/constants";
import { PageInfo } from "../utils/types";
import createFolders from "./createFolders";


(async (): Promise<void> => {
    await db.authenticate()
        .then(() => {
            db.sync({ force: true })
            console.log("Database connected...")
        })
        .catch((err: Error) => console.log(`Database Error: ${err.message}`));

    try {
        console.log('try')
        const ghGBPages: GroupBuyPage[] = await GrabGHGroupBuyLinks(GroupBuyURL);
        const ghGbPagesInfo: PageInfo[] = ghGBPages.map((page) => threadscrape(page));

        createFolders(ghGbPagesInfo);
        const saveInfo = await SaveToDatabase(ghGbPagesInfo);
        console.log('SAVE INFO...', saveInfo)
    } catch (error) {
        console.log('catch...', error)
        throw error
    }
})();
