import {test,expect} from '@playwright/test';
test('artwork renders, replays, responds to touch and exports a real PNG',async({page},testInfo)=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/');
  const heart=page.getByRole('button',{name:'Send Hiba a glowing heartbeat'});
  await expect(heart).toBeEnabled({timeout:30000});
  await expect(page.getByRole('status').filter({hasText:'The heart is complete'})).toHaveCount(1,{timeout:15000});
  await expect(page.locator('canvas')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  const pixels=await page.locator('canvas').evaluate((c:HTMLCanvasElement)=>{const d=c.getContext('2d')!.getImageData(0,0,c.width,c.height).data;let lit=0;for(let i=0;i<d.length;i+=4)if(d[i]>30)lit++;return lit;});
  expect(pixels).toBeGreaterThan(3000);
  if(testInfo.project.name==='desktop'){
    const fullscreen=page.getByRole('button',{name:'Enter fullscreen'});
    if(await fullscreen.count()){await fullscreen.click();await expect(page.getByRole('button',{name:'Exit fullscreen'})).toBeVisible();await page.getByRole('button',{name:'Exit fullscreen'}).click();}
  }
  await heart.click();
  const downloadPromise=page.waitForEvent('download');
  await page.getByRole('button',{name:'Save a moment'}).click();
  const download=await downloadPromise;expect(download.suggestedFilename()).toMatch(/Hiba.*\.png/);
  const path=await download.path();expect(path).toBeTruthy();
  const stream=await download.createReadStream();const chunks:Buffer[]=[];for await(const chunk of stream!)chunks.push(chunk);const png=Buffer.concat(chunks);expect(png.subarray(1,4).toString()).toBe('PNG');expect(png.readUInt32BE(16)).toBe(2000);
  await page.getByRole('button',{name:'Replay'}).click();
  await expect(page.getByRole('status').filter({hasText:'The heart is complete'})).toHaveCount(1,{timeout:15000});
  await page.screenshot({path:`test-results/${testInfo.project.name}.png`,fullPage:true});
  expect(errors).toEqual([]);
});
