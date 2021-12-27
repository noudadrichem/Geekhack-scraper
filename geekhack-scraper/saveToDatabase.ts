import images from "../database/images-model";
import threads from "../database/threads-model";
import { Image, PageInfo, Thread } from "../utils/types";
import downloadImages from "./getImagesForDatabase";

export const SaveToDatabase = async (pages: PageInfo[]): Promise<void> => {
    const threadsToSaveToDatabase: Thread[] = pages.map((page: PageInfo) => page.thread);
    console.log('threadsToSaveToDatabase...', threadsToSaveToDatabase)
    const imagesToTryToDownload: Image[] = pages.map((page) => page.image).flat();
    console.log('imagesToTryToDownload...', imagesToTryToDownload)
    const imagesToSaveToDatabase = await downloadImages(imagesToTryToDownload);
    console.log('imagesToSaveToDatabase...', imagesToSaveToDatabase)
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
