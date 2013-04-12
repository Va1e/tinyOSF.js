function osfParser(string) {
  var osfArray, i = 0, output = [], osfRegex = /(^([(\d+)(\u002D+)]*) ([^\u003C\u003E\u0023\n]+) *(\u003C[^\u003E]*\u003E)?((\s*\u0023[^\R\s]* ?)*)\n*)/gm;
  while ((osfArray = osfRegex.exec(string)) !== null) {
    output[i] = osfArray;
    i += 1;
  }
  return output;
}

function osfExport(osf) {
  var i, osfline, line, tags, url, osfFirstTS, osfTime, time, parsed = '';
  for(i=0; i< osf.length; i+=1) {
    osfline = osf[i];
    osfTime = parseInt(osfline[2],10);
    if((osfFirstTS === undefined)&&(typeof osfTime === 'number')) {
      osfFirstTS = osfTime;
    }
    if(typeof osfTime === 'number') {
      time = osfCalculateTime(osfTime, osfFirstTS);
    }
    if(typeof osfline[4] === 'string') {
      url = osfline[4].replace(/\u003C/,'').replace(/\u003E/,'');
    } else {
      url = false;
    }
    tags = osfExtractTags(osfline[5],url);
    if(osfline !== undefined) {
      if(url !== false) {
        line = '<a'+osfBuildTags(tags,true)+'  href="'+url+'">'+osfline[3].trim()+'</a>';
      } else {
        line = '<span'+osfBuildTags(tags,true)+'>'+osfline[3].trim()+'</span>';;
      }
      
      if(tags.indexOf('chapter') !== -1) {
        line = '<h2>'+line+'<small>('+time+')</small></h2>';
        parsed += line;
      } else {
        parsed += line+'; ';
      }
    }
  }
  return parsed;
}

function osfExtractTags(tagString,urlString) {
  var tagArray = [], tagTempArray = [], i, urlTemp, tagTemp;
  tagTempArray = tagString.split(' ');
  for(i=0;i<tagTempArray.length;i+=1) {
    tagTemp = tagTempArray[i].replace('#','').trim();
    if(tagTemp.length === 1) {
      if(tagTemp === 'c') {
        tagTemp = 'chapter';
      } else if(tagTemp === 't') {
        tagTemp = 'topic';
      } else if(tagTemp === 'g') {
        tagTemp = 'glossary';
      } else if(tagTemp === 'l') {
        tagTemp = 'link';
      } else if(tagTemp === 's') {
        tagTemp = 'section';
      } else if(tagTemp === 'v') {
        tagTemp = 'video';
      } else if(tagTemp === 'a') {
        tagTemp = 'audio';
      } else if(tagTemp === 'i') {
        tagTemp = 'image';
      } else if(tagTemp === 'q') {
        tagTemp = 'quote';
      }
    }
    if(tagTemp.length > 3) {
      tagArray[i] = tagTemp;
    }
  }
  if(urlString !== false) {
    urlTemp = urlString.split('/')[2];
    urlTemp = urlTemp.split('.');
    tagArray[i+1] = urlTemp[urlTemp.length-2]+urlTemp[urlTemp.length-1];
  }
  return tagArray;
}

function osfBuildTags(tagArray, withClass) {
  var i, output = '';
  for(i=0;i<tagArray.length;i+=1) {
    if(typeof tagArray[i] === 'string') {
      if(tagArray[i].trim().length > 3) {
        output += ' osf_'+tagArray[i];
      }
    }
  }
  if(withClass === true) {
    return ' class="'+output+'"';
  }
  return output;
}

function osfCalculateTime(now,starttimestamp) {
  var time = parseInt(now, 10) - parseInt(starttimestamp, 10),
      date, hours, minutes, seconds, returntime = '';
  hours = Math.floor(time / 3600);
  minutes = Math.floor((time - (hours * 3600)) / 60);
  seconds = time - (hours * 3600) - (minutes * 60);
  returntime += (hours < 10) ? '0' + hours + ':' : hours + ':';
  returntime += (minutes < 10) ? '0' + minutes + ':' : minutes + ':';
  returntime += (seconds < 10) ? '0' + seconds : seconds;
  return returntime;
}