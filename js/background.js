const paytm_api_url = "https://paytm.com/papi/v2/gold/product-portfolio";
const aditya_api_url = {
    buy : "https://mywealth.adityabirlacapital.com/digital-gold/GetRateToBuy",
    sell : "https://mywealth.adityabirlacapital.com/digital-gold/GetRateToSell"
} 

const loading = document.querySelector(".loading");
const buy = document.querySelector(".buy");
const sell = document.querySelector(".sell");
const merchant = document.querySelector(".merchant");
const results = document.querySelector(".result-container");
const disclaimer = document.querySelector(".disclaimer");

const default_merchant = "MMTC-PAMP";

const fetchGoldPriceFromPaytm = async () => {
    fetch(paytm_api_url)
    .then(response => response.json()) 
    .then(json => {
        const response = json;
        setDisplayData({
            buy_amount : response.portfolio.product_level[0].price_per_gm,
            sell_amount : response.portfolio.product_level[0].sell_price_per_gm,
            merchant : response.portfolio.product_level[0].merchant.name
        })
    })
    .catch(err => console.log(err));
};

const fetchGoldPrice = async (api_url) => {
    return new Promise((resolve, reject) => {
        fetch(api_url, {
            method: "POST",
            body: JSON.stringify({}),
            headers: {"Content-type": "application/json; charset=UTF-8","Access-Control-Allow-Origin": "*"}
        })
        .then(response => response.json()) 
        .then(json => resolve(json))
        .catch(err => reject(err));
    })
};

const fetchBuySellFromAditya = ()=>{
    Promise.all([fetchGoldPrice(aditya_api_url.buy),fetchGoldPrice(aditya_api_url.sell)])
    .then((outputs)=>{     
        if(outputs && outputs[0] && outputs[1] && outputs[0].success && outputs[1].success){
            setDisplayData({
                buy_amount : outputs[0].response.data.BeforeTaxAmt,
                sell_amount : outputs[1].response.data.BeforeTaxAmt,
                merchant : default_merchant
            })
        }
    })
    .catch(err=>console.log(err));
}

const setDisplayData = (info)=>{
    loading.style.display = "block";
    disclaimer.style.display = 'block';
    loading.style.display = "none";
    buy.textContent = info.buy_amount;
    sell.textContent = info.sell_amount;
    merchant.textContent = info.merchant + " GOLD";
    results.style.display = "block";
}

Math.random() < 0.5 ? fetchGoldPriceFromPaytm() : fetchBuySellFromAditya();