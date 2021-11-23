import { JSDOM } from "jsdom";
import { beforeAll, describe, expect, test } from "@jest/globals";
import {
  getAuthor,
  getFormattedModDate,
  getFormattedStartDate,
  getFormattedTitle,
  getImageLinks,
} from "../geekhack-scraper/threadscrape";

describe("threadscape", () => {
  let dom: JSDOM;
  beforeAll(async () => {
    dom = await JSDOM.fromURL("https://geekhack.org/index.php?topic=92066.0");
  });

  test("getAuthor returns the author of the thread", () => {
    const author = getAuthor(dom);

    expect(author).toBe("xondat");
  });

  test("getFormattedModDate returns the date when the thread was modified", () => {
    const modDate = getFormattedModDate(dom);

    expect(modDate).toBe(1587758881000);
  });

  test("getFormattedStartDate returns the date when the thread was started", () => {
    const startDate = getFormattedStartDate(dom);

    expect(startDate).toBe(1507945962000);
  });

  test("getFormattedTitle returns the title of the thread", () => {
    const title = getFormattedTitle(dom);

    expect(title).toBe("Noxary 268 (100% Shipped)");
  });

  test("getImageLinks returns an array of image links on the thread", () => {
    const expectedImageLinks = [
      "https://i.imgur.com/rwqp3Au.jpg",
      "https://i.imgur.com/CXEJ4sn.jpg",
      "https://i.imgur.com/N3owNLK.jpg",
      "https://i.imgur.com/ETQAiNS.png",
      "https://i.imgur.com/dF6UXLZ.png",
    ];
    const imageLinks = getImageLinks(dom);

    expect(imageLinks).toEqual(expect.arrayContaining(expectedImageLinks));
  });
});
