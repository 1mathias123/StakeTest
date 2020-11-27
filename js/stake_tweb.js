const config_json = {
  LIGHTMATTER: {
    num:1,
    tokenAddress: 'TUKhG4PsgEsL7xEk42eHaDQPDrnzZsTNqo',
    stakeDataAddress: 'TNHWDRLhav6BaiBMx2ag3kcDBpbmjkWK7d',
    stakeHandlerAddress: 'TLaX8kmd41u7wg9pHcXihACNgMogwwgeiT',
    decimals: 1e6,
  },
  DARKMATTER: {
    num:2,
    tokenAddress: 'TUKhG4PsgEsL7xEk42eHaDQPDrnzZsTNqo',
    stakeDataAddress: 'TNHWDRLhav6BaiBMx2ag3kcDBpbmjkWK7d',
    stakeHandlerAddress: 'TLaX8kmd41u7wg9pHcXihACNgMogwwgeiT',
    decimals: 1e6,
  },
  VOID: {
    num:3,
    tokenAddress: 'TUKhG4PsgEsL7xEk42eHaDQPDrnzZsTNqo',
    stakeDataAddress: 'TNHWDRLhav6BaiBMx2ag3kcDBpbmjkWK7d',
    stakeHandlerAddress: 'TLaX8kmd41u7wg9pHcXihACNgMogwwgeiT',
    decimals: 1e6,
  },
  FRAG: {
    num:4,
    tokenAddress: 'TUKhG4PsgEsL7xEk42eHaDQPDrnzZsTNqo',
    stakeDataAddress: 'TNHWDRLhav6BaiBMx2ag3kcDBpbmjkWK7d',
    stakeHandlerAddress: 'TLaX8kmd41u7wg9pHcXihACNgMogwwgeiT',
    decimals: 1e6,
  },
}

//rounding functions
function parseFloat(str, radix) {
  let parts = str.split(".");
  if ( parts.length > 1 ) {
    return parseInt(parts[0], radix) + parseInt(parts[1], radix) / Math.pow(radix, parts[1].length);
  }
  return parseInt(parts[0], radix);
}

function roundToFour(num) {
  return +(Math.floor(num + 'e+4') + 'e-4')
}

function roundToTwo(num) {
  return +(Math.floor(num + 'e+2') + 'e-2')
}

function round(num) {
  return +(Math.floor(num + 'e+0') + 'e-0')
}

function roundToTwoOrFour(num){
  if(num<1) return roundToFour(num)
  return roundToTwo(num)
}

//updateHTML
let selected = "LIGHTMATTER"
let tokenSelected = undefined
setInterval(()=>{
  tokenSelected = config_json[selected]
  updateStakedBalance(tokenSelected)
  updateTotalStaked(tokenSelected)
  updateCycleRewards(tokenSelected)
  updateRewards(tokenSelected)
}, 2000)
setInterval(()=>{
  updateTotal()
}, 5000)

async function updateStakedBalance(tokenSelected) {
  stakeDataInstance = await tronWeb.contract().at(tokenSelected.stakeDataAddress)
  const stakedBalance = await stakeDataInstance.getMyStakeedTokens().call()
  document.getElementById('token'+tokenSelected.num).setAttribute('data-staked', roundToTwoOrFour(parseFloat(stakedBalance._hex, 16)/tokenSelected.decimals))
}

async function updateTotalStaked(tokenSelected) {
  stakeDataInstance = await tronWeb.contract().at(tokenSelected.stakeDataAddress)
  const total = await stakeDataInstance.getTokenBalance().call()
  document.getElementById('token'+tokenSelected.num).setAttribute('data-total-staked', roundToTwoOrFour(parseFloat(total._hex, 16)/tokenSelected.decimals))
}
async function updateCycleRewards(tokenSelected) {
  stakeHandlerInstance = await tronWeb.contract().at(tokenSelected.stakeHandlerAddress)
  const total = await stakeHandlerInstance.calculateMyCurrentCycleRewards().call()
  document.getElementById('token'+tokenSelected.num).setAttribute('data-payout', roundToTwoOrFour(parseFloat(total._hex, 16)/tokenSelected.decimals))
}

async function updateRewards(tokenSelected) {
  stakeHandlerInstance = await tronWeb.contract().at(tokenSelected.stakeHandlerAddress)
  const total = await stakeHandlerInstance.calculateMyRewardsSinceLastClaim().call()
  document.getElementById('token'+tokenSelected.num).setAttribute('data-earning', roundToTwoOrFour(parseFloat(total._hex, 16)/tokenSelected.decimals))
}

async function updateTotal(){
    lightmatterContract = await tronWeb.contract().at(config_json['LIGHTMATTER'].stakeHandlerAddress)
    darkmatterContract = await tronWeb.contract().at(config_json['DARKMATTER'].stakeHandlerAddress)
    voidContract = await tronWeb.contract().at(config_json['VOID'].stakeHandlerAddress)
    fragContract = await tronWeb.contract().at(config_json['FRAG'].stakeHandlerAddress)
    const totalLight = await stakeHandlerInstance.calculateMyRewardsSinceLastClaim().call()
    const totalDark = await stakeHandlerInstance.calculateMyRewardsSinceLastClaim().call()
    const totalVoid = await stakeHandlerInstance.calculateMyRewardsSinceLastClaim().call()
    const totalFrag = await stakeHandlerInstance.calculateMyRewardsSinceLastClaim().call()
    document.getElementById('lmh-total').innerHTML = roundToTwoOrFour(parseFloat(totalLight._hex, 16)/config_json['LIGHTMATTER'].decimals)
    document.getElementById('dmd-total').innerHTML = roundToTwoOrFour(parseFloat(totalDark._hex, 16)/config_json['DARKMATTER'].decimals)
    document.getElementById('void-total').innerHTML = roundToTwoOrFour(parseFloat(totalVoid._hex, 16)/config_json['VOID'].decimals)
    document.getElementById('frag-total').innerHTML = roundToTwoOrFour(parseFloat(totalFrag._hex, 16)/config_json['FRAG'].decimals)
}
/*
async function updateNextPayout() {
  stakingInstance = await tronWeb.contract().at(stakingAddress)
  const date = new Date()
  let nextPayoutAt = await stakingInstance.nextPayoutAt().call()
  nextPayoutAt = new Date(parseInt(nextPayoutAt._hex)*1000)
  let timeLeft = nextPayoutAt - date
  setInterval(()=>{
    var seconds = Math.floor((timeLeft / 1000) % 60);
    var minutes = Math.floor((timeLeft / 1000 / 60) % 60);
    var hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
    timeLeft = timeLeft - 1000
    document.getElementById('time-left').innerHTML = `${('0'+hours).slice(-2)}:${('0'+minutes).slice(-2)}:${('0'+seconds).slice(-2)}`
  },1000)
}
*/
/*
async function apy() {
  stakingInstance = await tronWeb.contract().at(stakingAddress)
  const rewardRate = await stakingInstance.rewardRate().call()
  const totalSupply = await stakingInstance.totalSupply().call()
  document.getElementById('apy').innerHTML = roundToTwoOrFour(parseFloat(totalSupply._hex, 16)/parseFloat(rewardRate._hex, 16))
}
*/

async function stake() {
  tokenInstance = await tronWeb.contract().at(tokenSelected.tokenAddress)
  let amount = document.getElementById('stake_amount').value
  amount = amount * tokenSelected.decimals
  const bytes = '0x000000000000000000000000000000000000000000000000000000000000000'
  await tokenInstance.methods.approveAndCall(tokenSelected.stakeDataAddress, amount, bytes).send()
}


async function unstake() {
  stakeDataInstance = await tronWeb.contract().at(tokenSelected.stakeDataAddress)
  const amount = document.getElementById('unstake_amount').value
  await stakeDataInstance.unstakeTokens(amount*tokenSelected.decimals).send()
}

async function claim() {
  stakeHandlerInstance = await tronWeb.contract().at(tokenSelected.stakeHandlerAddress)
  await stakeHandlerInstance.claimRewards().send()
}

$('#click-left').click(function(err) {
   selected = document.getElementById('arrow-left').innerHTML.replace(' ', '').toUpperCase()
})
$('#click-right').click(function(err) {
   selected = document.getElementById('arrow-right').innerHTML.replace(' ', '').toUpperCase()
})
$( "#stake" ).click(function() {
  stake()
})

$( "#unstake" ).click(function() {
  unstake()
})

$( "#claim" ).click(function() {
  claim()
})
