<script>
 import {
    currentTimestamp
  } from "./stores.js"; 
  import { fly, blur } from 'svelte/transition';

  let date;
  let day;
  let month;
  let weather;

  // ensoleillement, mm de pluie
  const weatherList = [[0,6.5],
    [0,2.4],
    [1,6.6],
    [4,0],
    [2,0.2],
    [2,6.9],
    [6,0.4],
    [4,0],
    [5,1.8],
    [0,0.6],
    [1,2.6],
    [3,6.4],
    [1,4.8],
    [1,3.8],
    [0,17],
    [0,0],
    [2,0],
    [0,1.6],
    [2,0],
    [8,0],
    [5,0.4],
    [5,3.2],
    [0,2.2],
    [4,0],
    [3,0.2],
    [0,12.3],
    [0,1.2],
    [1,0.2],
    [0,0.6],
    [4,2.4],
    [0,0.4],
    [6,0.2],
    [3,0],
    [7,0],
    [0,0],
    [0,2.6],
    [1,0],
    [0,12.3],
    [2,6.2],
    [4,2.2],
    [1,1],
    [0,14.3],
    [5,2.4],
    [3,2.2],
    [1,4.6],
    [0,4.5],
    [2,0.2],
    [5,0],
    [0,12.7],
    [3,2],
    [0,6.2],
    [2,0.4],
    [2,3.6],
    [5,0],
    [2,0],
    [2,8.6],
    [0,0],
    [0,0],
    [6,0],
    [7,0],
    [6,0],
    [0,1.2],
    [0,0.4],
    [2,0.2],
    [4,0],
    [0,0],
    [7,0],
    [0,0],
    [0,0.6],
    [0,4.2],
    [0,0],
    [4,0],
    [1,0],
    [0,0.2],
    [0,0],
    [2,1.2],
    [7,1.4],
    [3,0.8],
    [6,0],
    [4,0],
    [7,0],
    [8,0],
    [8,0],
    [3,0],
    [6,0],
    [0,0],
    [1,3.8]];

  const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

  $: {
    const d = new Date(2019, 10, 1);
    d.setDate(d.getDate() + $currentTimestamp / 24);
    date = d;
  }

  $: {
    weather = weatherList[Math.floor($currentTimestamp / 24)];
  }

  $: day = date.getDate();
  $: month = months[date.getMonth()];


</script>

<div class='fixed top-0 mt5 flex justify-center w-100 z-999 fw6 f3'>
<div class='w5 h3 bg-white shadow-1 tc pa3 flex justify-center code'>
{#if ($currentTimestamp - 1) % 24}
<div class='pr2 w3 tc' id={day} in:fly={{y: -50}} out:fly={{y: 50}}>{day}</div> 
{/if}
<div class='pr2 w4' id={month}  in:fly={{y: -50}} out:fly={{y: 50}}>{month}</div> 
<div class='w3 tc'>
{#if day === 25 && month === 'décembre'}
<div class='absolute pl1' transition:blur={{duration: 300}}>🎅🏼</div> 
{:else if day === 31 && month === 'décembre'}
<div class='absolute pl1' transition:blur={{duration: 300}}>🍾</div> 
{:else if day === 1 && month === 'janvier'}
<div class='absolute pl1' transition:blur={{duration: 300}}>😴</div> 
{:else if weather[0] > 5}
<div class='absolute pl1' transition:blur={{duration: 300}}>☀️</div>
{:else if weather[0] > 3}
<div class='absolute pl1' transition:blur={{duration: 300}}>🌤</div>
{:else if weather[1] > 12}
<div class='absolute pl1' transition:blur={{duration: 300}}>🌧</div> 
{:else if weather[1] > 6}
<div class='absolute pl1' transition:blur={{duration: 300}}>🌦</div> 
{:else }
<div class='absolute pl1' transition:blur={{duration: 300}}>🌥</div> 
{/if}
 </div>

</div>
</div>