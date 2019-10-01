var express = require('express');
var router = express.Router();
var axios = require('axios');
var HTMLParser = require('node-html-parser');
var cheerio = require('cheerio');

// Tools
const titleCase = (phrase) => {
  return phrase
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

let socialMediaCheck = async (pageName, res, next)=>{
  let result = { 
    isInstagramAvailable: false,
    isTwitterAvailable: false,
    isFacebookAvailable: false,
  }
  let resp = {};
  if(!pageName){
    res.json({error: "name: null " + pageName});
    
    return;
  }

  // Instagram
  try{
    resp = await axios.get('https://www.instagram.com/'+pageName);
  }catch(e){
    if(e.message.includes('404')){
      result['isInstagramAvailable'] = true; 
    }
  }

  // Twitter
  try{
    resp = await axios.get('https://twitter.com/'+pageName);
  }catch(e){
    if(e.message.includes('404')){
      result['isTwitterAvailable'] = true;
    }
  }    

  // Facebook
  try{
    resp = await axios.get(`https://www.google.com/search?q=${pageName}+facebook+page&aqs=chrome..69i57j33.4695j1j0&sourceid=chrome&ie=UTF-8`);
    const $ = cheerio.load(resp);
    
    if($.html().includes(`${pageName} - Home | Facebook`)){
      console.log('found');
    }else{
      result["isFacebookAvailable"] = true;
      console.log('false', pageName);
    }
   
  }catch(e){
    console.log(e)
  }
  
  res.json(result);
}

/* GET home page. */
router.get('/', function(req, res, next) {
  let name = req.query.name;
  
  name = titleCase(name);

  socialMediaCheck(name, res, next);
});

module.exports = router;

