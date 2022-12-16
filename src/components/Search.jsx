import { Link, useParams, useLocation, useSearchParams } from "react-router-dom";
import { useState, useEffect, useRef, React } from "react";
import axios from "axios";

function Search() {
  let params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [cards, setCards] = useState([]);
  const [title, setTitle] = useState([]);
  const [navigation, setNavigation] = useState([]);
  const itemsRef = useRef([]); const itemsRef2 = useRef([]); const itemsRef3 = useRef([]);
  const [chapter, setChapter] = useState();

  let url = "/assets/json/bible.json"; let url2 = "/assets/json/title.json";
  let b = [];


  async function speak(chap,index) {
    window.speechSynthesis.cancel();
    if (itemsRef.current[index].src.indexOf("stop.svg") != -1) { // contains play
        itemsRef.current[index].src = '/assets/images/play.svg';
      return;
    }
    let sentences = [];
    sentences.push(chap);
    getNextAudio(sentences[0], 0);

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

 
  function biblecontent(response,q,titlecontents) {
    var r = response.data.filter(function (obj) {
      return (obj.t.indexOf(q) >= 0);
    });

    b = []; // clearing array first
    {(() => {
      var td = [];
      if(r.length <= 0){
        td.push(
          <div className="text-center fw-lighter mb-3 text-secondary">No results found</div>
         );
      }
      else if(r.length <=500 ){
        td.push(
        <div className="text-center fw-lighter mb-3 text-secondary">{r.length} results found</div>
       );
      }
       else{
        td.push(
          <div className="text-center fw-lighter mb-3 text-secondary">Showing the first 500 results of {r.length}</div>
         );
       }
        
        b.push(td)
      return td;
    })()}

    r.forEach((response, index) => {
      if(index >= 500){ return; }

      var m = titlecontents.data.filter(function (obj) {
        return (obj.n == response["b"]);
      });
      
      b.push(
        <div className="col mb-2 pushdata" id={`v-${response["v"]}`}>
          <div className="shadow-sm card ">
            <div className="card-body col-12" ref={el => itemsRef3.current[index] = el}>
            
              <div className="row row-col-2 g-2">
              {/* <div className="col-auto"><span className="fw-bold">{response["v"]}.</span></div> */}
                <div className="col text-left">{response["t"]}<Link className="link-dark small text-decoration-none" to={`/verse/${response["b"]}/${response["c"]}/${response["v"]}`}><div className="fw-bold text-primary">({m[0].bm} {response["c"]}:{response["v"]})</div></Link> </div>
                {(() => {
                  var td = [];
                  if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
                    td.push(
                      <div className="col-auto text-right ml-auto my-auto"><div style={{ "position": "relative", "margin-right": "-35px" }} className="arrowbutton"><a ref={el => itemsRef2.current[index] = el} onClick={e => speak(response["t"],index)} className="btn btn-small rounded-circle fw-bold arrowbutton"><img ref={el => itemsRef.current[index] = el} src="/assets/images/play.svg" /></a></div>
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
  }

  useEffect(() => {
    window.speechSynthesis.cancel();
    setCards(
      <div class="spinner-grow text-center" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    );


    let titlecontents;
    const titlenavi = async () => {
      const a = await getCacheData('content', url2);
      if(a){
        titlecontents =a;
      }else{
        (async () => {
          await axios
            .get(url2)
            .then(function (response) {
              addDataIntoCache('content', url2, response);
              titlecontents = response;
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
        biblecontent(a,searchParams.get("q"),titlecontents);
      }else{
        (async () => {
          await axios
            .get(url)
            .then(function (response) {
              addDataIntoCache('content', url, response);
              biblecontent(response,searchParams.get("q"),titlecontents);
            })
            .catch(function (error) {
              console.log(error);
            })
            .then(function () { });
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

export default Search;