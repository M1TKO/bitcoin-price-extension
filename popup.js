/*jshint esversion: 6 */

$(document).ready(() => {
    if (!!localStorage.btcAccount && !(localStorage.btcAccount == "undefined")) {
        getAccBalance(localStorage.btcAccount);
        $('#showAddress').text(localStorage.btcAccount);
    } else {
        updateInfo(updateInfoOnScreen);
    }
});


$("#account-input-btn").on('click', () => {
    var acc = $('#account-input').val().trim();
    if (!!acc) {
        getAccBalance(acc);
    } else {
        return;
    }
})

$('#update').on('click', () => {
    updateInfo(updateInfoOnScreen);
});

let updateInfo = (callback) => {
    $.ajax({
        type: "GET",
        url: "https://api.coindesk.com/v1/bpi/currentprice/BGN.JSON",
        data: null,
        dataType: "JSON",
        success: (response) => {
            var info = {};
            info.lv = response.bpi.BGN.rate_float;
            info.usd = response.bpi.USD.rate_float;
            callback(info.usd, info.lv);
        },
        error: (err)=>{
            console.log(e);
        }
    });
}
let updateInfoOnScreen = (usd, bgn, accValue = '') => {
    $('#bgn-price').text(bgn + ' лв');
    $('#usd-price').text('$ ' + usd);
    $('#myUsdAcc-price').text('$ ' + (usd * accValue));
    $('#myBgnAcc-price').text((bgn * accValue) + ' лв');
}

let getAccBalance = (account = '') => {
    $.ajax({
        type: "GET",
        url: "https://blockchain.info/q/addressbalance/" + account + "?confirmations=6",
        data: null,
        dataType: "JSON",
        success: (response) => {
            let balance = response / 100000000;
            updateInfo((usd, bgn) => {
                updateInfoOnScreen(usd, bgn, balance)
            });
        localStorage.setItem("btcAccount", account);


        },
        error: (e)=>{


        }
    });
}
