const initState = {leftNum: 0, rightNum: 0}
const apiUrl = 'https://script.googleusercontent.com/macros/echo?user_content_key=IOcUeUyFkQfmNnmY_HO8SlvQcxWFbk5WpvJQ1g4QGeg33mhyXDQC49oXmd49L1vTgb-4c4Wu2qAj33RsoY-CsTAQAhQEPN0em5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnMu8lWJqVW7FZYoEFpHHW7LeRoOVfGyK327hP4cZ2jrkbqnO48ZDWI7ateCnldto9ScfNc2fO4hD&lib=M_j4u1Zn8Qn7IOVXv3YaTcqizi72ibqj9'
let psyllium = {
  data : Object.freeze([
    { num: 0, japName: '白', colorCode: '#FFFFFF' },
    { num: 1, japName: '橙', colorCode: '#FFA500' },
    { num: 2, japName: '青', colorCode: '#0000FF' },
    { num: 3, japName: '黄', colorCode: '#FFFF00' },
    { num: 4, japName: '紫', colorCode: '#800080' },
    { num: 5, japName: '緑', colorCode: '#008000' },
    { num: 6, japName: '桃', colorCode: '#FFC0CB' },
    { num: 7, japName: '赤', colorCode: '#FF0000' },
    { num: 8, japName: '水', colorCode: '#00FFFF' },
    { num: 9, japName: '浅緑', colorCode: '#B9C42F' },
    { num: 10, japName: '翠', colorCode: '#00a968' },
    { num: 11, japName: '黒', colorCode: '#000' },
  ]),
  getNameByNum: (num) => { return psyllium.data.filter(v => v.num === num)[0].japName },
  getColorCodeByNum: (num) => { return psyllium.data.filter(v => v.num === num)[0].colorCode },
};
let addOne = (n) => {
  if(n<11){return n+1;}
  else{return n-11;}
};
let subOne = (n) => {
  if(n>0){return n-1;}
  else{return n+11;}
};
let counter = (state = initState, action) => {
  switch (action.type) {
    case 'LEFT_INCREMENT':
      state.leftNum = addOne(state.leftNum);
      return state;
    case 'LEFT_DECREMENT':
      state.leftNum = subOne(state.leftNum);
      return state;
    case 'RIGHT_INCREMENT':
      state.rightNum = addOne(state.rightNum);
      return state;
    case 'RIGHT_DECREMENT':
      state.rightNum = subOne(state.rightNum);
      return state;
    default:
      return state;
  }
}
let members = [{ name: 'Nextを推してください',pattern: '23 32' }];
let targetMember = {
  choiced: members[0],
  choice: () => { targetMember.choiced = members[Math.floor(Math.random() * 1000) % members.length] },
  isCorrect: (lightNum) => { 
    let ret = targetMember.choiced.pattern.indexOf(lightNum) >= 0;
    return ret;
  },
}
let store = Redux.createStore(counter);

let render = () => {
  $('h1')[0].innerText = targetMember.choiced.name;
  let leftNum = store.getState().leftNum;
  let rightNum = store.getState().rightNum;
  $('#left-psyllium').css('border-color', psyllium.getColorCodeByNum(leftNum));
  $('#left-psyllium').css('background-color', psyllium.getColorCodeByNum(leftNum));
  $('#right-psyllium').css('border-color', psyllium.getColorCodeByNum(rightNum));
  $('#right-psyllium').css('background-color', psyllium.getColorCodeByNum(rightNum));
}


let initResult = () => {
  $('#result-area')[0].innerText = '　';
}

let initMembers = () => {
  let dummy = $.ajax({
    url: apiUrl
  }).done((json) => {
    let j = JSON.parse(json);
    members = j.map((i)=>{return { name:i[0], pattern:i[1] }})
  }).fail(() => {
    $('#a').text('ERROR');
  });
}

let init = () => {
  initResult();
  initMembers();
  store.subscribe(render);
  render();
}
init();

$('#next')[0].addEventListener('click', () => {
  targetMember.choice();
  initResult();
  render();
});
$('#answer')[0].addEventListener('click', () => {
  let currentLightNum = '' + store.getState().leftNum + store.getState().rightNum;
  // console.log(currentLightNum);
  initResult();
  if(targetMember.isCorrect(currentLightNum)){ 
    $('#result-area')[0].innerText = '正解！';
  } else {
    $('#result-area')[0].innerText = '残念。。。';
  }
});
$('#left-increment')[0].addEventListener('click', () => {
  store.dispatch({ type:'LEFT_INCREMENT' })
});
$('#left-decrement')[0].addEventListener('click', () => {
  store.dispatch({ type:'LEFT_DECREMENT' })
});
$('#right-increment')[0].addEventListener('click', () => {
  store.dispatch({ type:'RIGHT_INCREMENT' })
});
$('#right-decrement')[0].addEventListener('click', () => {
  store.dispatch({ type:'RIGHT_DECREMENT' })
});