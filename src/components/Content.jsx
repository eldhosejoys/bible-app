import { Link, useParams, useLocation } from "react-router-dom";
import { useState, useEffect, useRef, React } from "react";
import axios from "axios";

function Content() {
  let params = useParams();
  const location = useLocation();
  const [cards, setCards] = useState([]);
  const [title, setTitle] = useState([]);
  const [navigation, setNavigation] = useState([]);
  const itemsRef = useRef([]); const itemsRef2 = useRef([]); const itemsRef3 = useRef([]);
  const [chapter, setChapter] = useState();
  // const [verse, setVerse] = useState(0);

  let url = "/assets/json/bible.json"; let url2 = "/assets/json/title.json";
  let b = [];

  let loadedCard = (e) =>{
    console.log("e: "+e)
    // setVerse(verse+1);
    if(params.verse && params.verse == parseInt(e)+1){
      console.log("verse: "+params.verse)
      itemsRef3.current[parseInt(params.verse)-1].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      }) ;
      itemsRef2.current[parseInt(params.verse)-1].style.backgroundColor = '#ffb380';
      itemsRef3.current[parseInt(params.verse)-1].style.backgroundColor = '#faebd7';
      setTimeout(
        () => {
      itemsRef2.current[parseInt(params.verse)-1].style.backgroundColor = '';
      itemsRef3.current[parseInt(params.verse)-1].style.backgroundColor = '';
        }, 
        3000
      );

    }
  }

  async function speak(chap,index) {
    window.speechSynthesis.cancel();

    if (itemsRef.current[index].src.indexOf("stop.svg") != -1) { // contains play
      itemsRef.current[index].src = '/assets/images/play.svg';
      return;
    }

    let sentences = [];
    for (var i = index; i < JSON.parse(chap).length; i++) {
      sentences.push(JSON.parse(chap)[i].t);

    }
    for (var i = 0; i < sentences.length; i++) {
      getNextAudio(sentences[i], i);
    }

    async function getNextAudio(sentence, i) {

      let audio = new SpeechSynthesisUtterance(sentence);
      audio.lang = "ml";
      window.speechSynthesis.speak(audio);
      let mestext = '';
      audio.onstart = (event) => {
        itemsRef.current[index + sentences.indexOf(event.utterance.text)].src = '/assets/images/stop.svg';
        itemsRef2.current[index + sentences.indexOf(event.utterance.text)].style.backgroundColor = '#ffb380';
        itemsRef3.current[index + sentences.indexOf(event.utterance.text)].style.backgroundColor = '#faebd7';
        itemsRef2.current[index + sentences.indexOf(event.utterance.text)].scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        });
        mestext = event.utterance.text;
      }
      audio.onend = (event) => {
        itemsRef.current[index + sentences.indexOf(mestext)].src = '/assets/images/play.svg';
        itemsRef2.current[index + sentences.indexOf(mestext)].style.backgroundColor = '';
        itemsRef3.current[index + sentences.indexOf(mestext)].style.backgroundColor = '';
      }

      // return new Promise(resolve => {
      //   audio.onend = resolve;

      // });
    }

  }

  // Function to add our give data into cache
  const addDataIntoCache = (cacheName, url, response) => {
    const data = new Response(JSON.stringify(response));
    if ('caches' in window) {
      caches.open(cacheName).then((cache) => {
        cache.put(url, data);
      });
    }
  };

  // Function to get cache data
  const getCacheData = async (cacheName, url) => {
    const cacheStorage = await caches.open(cacheName);
    const cachedResponse = await cacheStorage.match(url); // Returns a promise w/ matched cache
    if(!cachedResponse || !cachedResponse.ok) {return false}
    // console.log(await cachedResponse);
    // console.log(await cachedResponse.json()); // prints json object with value of key matched
    return await cachedResponse.json();
};

  function titlenav(response) {
    var r = response.data.filter(function (obj) {
      return (obj.n == params.book);
    });
 
    setNavigation(
      <div className="row row-2 justify-content-center mt-4">
        {(() => {
          var tp = [];
          
          if (params.chapter > 1 && params.chapter <= r[0].c) {
            tp.push(
              <div className="col-auto mr-auto "><Link to={`/verse/${params.book}/${parseInt(params.chapter) - 1}`} ><div className="arrowbutton"><a className="btn rounded-circle arrowbutton"><img className="" src="/assets/images/arrow-left.svg" alt="" /></a></div></Link></div>
            );
          }
          if (params.chapter < r[0].c && params.chapter >= 1) {
            tp.push(
              <div className="col-auto "><Link to={`/verse/${params.book}/${parseInt(params.chapter) + 1}`}><div className="arrowbutton"><a className="btn rounded-circle arrowbutton"><img className="" src="/assets/images/arrow-right.svg" alt="" /></a></div> </Link> </div>
            );
          }
          return tp;
        })()}
      </div>
    );

    setTitle(
      <div className="text-center mb-2"><div><h3 className=""><span className="text-primary fw-bold"><Link className="text-decoration-none" to={`/verse/${r[0].n}/1`} >{r[0].bm}</Link></span> - അദ്ധ്യായം {params.chapter}</h3></div>
        <div className="row row-cols-auto mt-3 justify-content-center">
          {(() => {
            let td = [];
            for (let i = 1; i <= r[0].c; i++) {
              if (i == params.chapter) {
                td.push(
                  <div key={i} className="numberbox" ><Link className="link-dark small text-decoration-none" to={`/verse/${params.book}/${i}`} ><div className="col numberbox" style={{ "background-color": "#8D9EFF" }}>{i}</div></Link> </div>
                );
              }
              else {
                td.push(
                  <div key={i} className="numberbox"><Link className="link-dark small text-decoration-none" to={`/verse/${params.book}/${i}`} ><div className="col numberbox">{i}</div></Link> </div>
                );
              }
            }
            return td;
          })()}
        </div>
      </div>
    );
  }

  function biblecontent(response) {
    var r = response.data.filter(function (obj) {
      return (obj.b == params.book && obj.c == params.chapter);
    });

    b = []; // clearing array first
    let chap =JSON.stringify(r);
    r.forEach((response, index) => {
      b.push(
        <div className="col mb-2 pushdata" id={`v-${response["v"]}`}>
          <div className="shadow-sm card ">
            <div className="card-body col-12" ref={el => itemsRef3.current[index] = el}>
              <div className="row row-col-3 g-2">
                <div className="col-auto"><span className="fw-bold">{response["v"]}.</span></div>
                <div className="col text-left">{response["t"]}</div>
                {(() => {
                  var td = [];
                  if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
                    td.push(
                      <div className="col-auto text-right ml-auto my-auto"><div style={{ "position": "relative", "margin-right": "-35px" }} className="arrowbutton"><a ref={el => itemsRef2.current[index] = el} onClick={e => speak(chap,index)} className="btn btn-small rounded-circle fw-bold arrowbutton"><img onLoad={(e) => {if(parseInt(params.verse) == index+1){loadedCard(index);}}} ref={el => itemsRef.current[index] = el} src="/assets/images/play.svg" /></a></div>
                      </div>
                    );
                  }
                  return td;
                })()}

              </div>
            </div>
          </div>
        </div>
      );
    });
    setCards(b);
    if (params.verse && b.length >= params.verse) {
      console.log("inside");

    }
    
  }

  useEffect(() => {
    window.speechSynthesis.cancel();
    setCards(
      <div class="spinner-grow text-center" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    );


    const titlenavi = async () => {
      const a = await getCacheData('content', url2);
      if(a){
        titlenav(a);
      }else{
        (async () => {
          await axios
            .get(url2)
            .then(function (response) {
              addDataIntoCache('content', url2, response);
              titlenav(response);
            })
            .catch(function (error) {
              console.log(error);
            })
            .then(function () { });
        })();
      }
    };
    titlenavi();

    const biblecontents = async () => {
      const a = await getCacheData('content', url);
      if(a){
        biblecontent(a);
      }else{
        (async () => {
          await axios
            .get(url)
            .then(function (response) {
              addDataIntoCache('content', url, response);
              biblecontent(response);
            })
            .catch(function (error) {
              console.log(error);
            })
            .then(function () { 
              
            });
        })();
      }
    };
    biblecontents();
  }, [location]);


  return (
    <section className="py-2 mb-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <section id="scroll-target">
              <div className="container my-2">
                <div className="row row-cols-1 justify-content-center">
                  {title}
                  {cards}
                  {navigation}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Content;