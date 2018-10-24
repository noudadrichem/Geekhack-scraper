const fs = require("fs");
const mkdirp = require("mkdirp");

module.exports = async function(browser, url) {
  // (async () => {
  const page = await browser.newPage();
  // await page.goto('https://geekhack.org');
  // page.setViewport({ width: 1920, height: 978 });

  await page.goto(url, { waitUntil: "networkidle0" });
  console.log("went to the site");
  const pageStartDate = await page.evaluate(() =>
    document
      .querySelector(
        "#quickModForm > div:nth-child(1) > div > div.postarea > div.flow_hidden > div > div.smalltext"
      )
      .innerHTML.replace("« <strong> on:</strong> ", "")
      .replace(" »", "")
  );
  const pageTitle = await page.evaluate(
    () => document.querySelector("[id^='subject_']").innerText
  );
  const urlTopicID = url.split("=")[1].split(".")[0];
  console.log("ID = " + urlTopicID);

  const allImagesWithThreadStarter = await page.evaluate(() => {
    let allPosts = document.querySelectorAll(".post_wrapper");
    let wantedImgLinks = [];
    for (var i = 0; i < allPosts.length; i++) {
      let threadStarterCheck;
      if (
        allPosts[i].children[0].children[1].children[1].className ==
        "membergroup"
      ) {
        threadStarterCheck =
          allPosts[i].children[0].children[1].children[2].className;
      } else {
        threadStarterCheck =
          allPosts[i].children[0].children[1].children[1].className;
      }

      if (threadStarterCheck == "threadstarter") {
        // the post of the thread starter
        console.log("threadstarter");
        // https://www.aymen-loukil.com/en/blog-en/google-puppeteer-tutorial-with-examples/
        let wantedPosts = Array.from(
          allPosts[i].children[1].querySelectorAll("img.bbc_img:not(.resized)")
        );
        let wantedImages = wantedPosts.map(img => img.src).slice(0, 10);
        wantedImgLinks = wantedImgLinks.concat(wantedImages);
      }
    }
    return wantedImgLinks;
  });

  // if it's a google link
  // page.on("response", async resp => {
  //   headers = resp.headers();
  //   filename = headers["content-disposition"]
  //   if (!typeof filename == "undefined"){
  //    filename.split("=")[1].replace(/\"/g, "");
  //    const buffer = await resp.buffer();
  //    fs.writeFileSync(__dirname + "\\" + filename, buffer);
  //   }
  // });

  let path = __dirname + `/images/${urlTopicID}`;

  if (!fs.existsSync(path)) {
    mkdirp(path, function(err) {
      if (err) console.log(err);
      else console.log("directory created");
    });
  }

  await page._client.send("Network.enable", {
    maxResourceBufferSize: 1024 * 1204 * 100,
    maxTotalBufferSize: 1024 * 1204 * 200
  });

  if (allImagesWithThreadStarter.length <= 0) {
    console.log("no images to save");
  } else {
    for (var a = 0; a < allImagesWithThreadStarter.length; a++) {
      let imageURL = allImagesWithThreadStarter[a];
      if (imageURL.includes("photobucket.com")) {
        continue;
      }
      // gets the name and extension of the image url.
      let imageRegex = new RegExp("(?:[^/][\\d\\w\\.]+)+$", "g");
      ///.*\.(jpg|png|gif)$/
      let imagePathName = imageRegex.exec(imageURL);

      if (imagePathName[0].includes("?")) {
        imagePathName[0] = imagePathName[0].split("?")[0];
      }

      if (imagePathName && imagePathName.length === 1) {
        // let extension = imagePathName[1];
        try {
          var imageSource = await page.goto(imageURL);
        } catch (err) {
          continue;
        }
        fs.open(path + `/${imagePathName[0]}`, "wx", function(err) {
          if (err) {
            if (err.code === "EEXIST") {
              console.log("image already saved. skipping");
              return;
            }
            throw err;
          }

          fs.writeFile(
            path + `/${imagePathName[0]}`,
            imageSource.buffer(),
            "wx",
            function(err) {
              if (err) {
                return console.log(err);
              }
              console.log("saved image");
            }
          );
        });
      }
    }
  }
  await page.close();
  let timeUpdated = new Date().toUTCString();
  var json = {
    id: urlTopicID,
    url: url,
    title: pageTitle,
    startdate: pageStartDate,
    lastupdated: timeUpdated
  };
  json = JSON.stringify(json);
  fs.writeFile(path + `/info.json`, json, err => {
    if (err) {
      console.log(err);
    } else {
      console.log("wrote json");
    }
  });
  console.log("-------done-------");
  // await page.waitForSelector('#jpg', {timeout: 60000});
  // console.log('waited');
  // await page.screenshot({path: 'images/example.png', fullPage: true});
  // })();
};
