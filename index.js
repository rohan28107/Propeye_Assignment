const puppeteer = require('puppeteer');
const fs = require('fs');

const getJobs = async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
    });

    const page = await browser.newPage();

    // To Search for Particular Job Roles change the value
    let searchquery = "devops-engineer";

    await page.goto(`https://www.foundit.in/search/${searchquery}-jobs`, {
        waitUntil: "domcontentloaded",
    });

    const jobs = await page.evaluate(() => {
        const jobList = document.querySelectorAll(".cardContainer");

        return Array.from(jobList).map((job) => {
            const jobTitle = job.querySelector(".jobTitle a").innerText;
            const companyName = job.querySelector(".companyName span").innerText;
            const postDate = job.querySelector(".timeText").innerText;
            // const jobDescription  = job.querySelector(".jobDescInfo").innerText;
            const jobUrl = job.querySelector(".jobTitle a").getAttribute('href');
            const features = job.querySelector(".details  a").innerText;
            const location = job.querySelector(".details > .under-link").innerText;
            return { jobTitle, companyName, location, postDate, jobUrl, features };
        });
    });
    console.log(jobs);
    fs.writeFile('jobs.json', JSON.stringify(jobs), err => {
        if (err) throw err;
        console.log('Job details saved to file!');
      });

    await browser.close();
};

getJobs();



