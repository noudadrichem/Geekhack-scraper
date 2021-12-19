import images from "../database/images-model";
import threads from "../database/threads-model";
import { Image, PageInfo, Thread } from "../utils/types";
import downloadImages from "./getImagesForDatabase";

export const SaveToDatabase = async (pages: PageInfo[]): Promise<void> => {
    const threadsToSaveToDatabase: Thread[] = pages.map((page: PageInfo) => page.thread);
    const imagesToTryToDownload: Image[] = pages.map((page) => page.image).flat();
    const imagesToSaveToDatabase = await downloadImages(imagesToTryToDownload);
    const threadsSaved = await threads.bulkCreate(threadsToSaveToDatabase, {
        updateOnDuplicate: ["website", "title", "scraped", "updated"],
    });

    console.log('threadsSaved...', threadsSaved)

    if (threadsSaved) {
        await images.bulkCreate(imagesToSaveToDatabase, {
            ignoreDuplicates: true,
        });
    }
};
