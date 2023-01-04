import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

function Index() {
  const [cards, setCards] = useState([]);
  const itemsRef = useRef([]);

  function collapse(a) {
    if (itemsRef.current[a].style.display == 'none') {
      itemsRef.current[a].style.display = '';
    } else {
      itemsRef.current[a].style.display = 'none';
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
    if (!cachedResponse || !cachedResponse.ok) { return false }
    // console.log(await cachedResponse);
    // console.log(await cachedResponse.json()); // prints json object with value of key matched
    return await cachedResponse.json();
  };

  function biblechapters(response) {
    let b = []; let c = [];
    response.data.forEach((response) => {
      b.push(
        <div className="col mb-1 justify-content-center">
          <div className="shadow-sm card flex-row flex-wrap hover-effect mb-3">
            <div className="card-body col-12 col-sm-9 text-center">
              <h5 className="card-title text-center text-primary fw-bolder"><Link className="text-decoration-none" to={`/verse/${response["n"]}/1`} >{response["bm"]}</Link></h5>
              <div className="small fw-bold"><img src="/assets/images/writer.png" alt="ഗ്രന്ഥകാരൻ" height="28px" /> {response["w"]}</div>
              <div className="small fst-italic mt-2"><img src="/assets/images/date.png" alt="എഴുതിയ കാലഘട്ടം" height="28px" /> {response["d"]}</div>

              <div style={{ "display": "none" }} key={response["n"]} ref={el => itemsRef.current[response["n"]] = el} className="row row-cols-auto mt-3 justify-content-center">

                {(() => {
                  let td = [];
                  for (let i = 1; i <= response["c"]; i++) {
                    td.push(
                      <div className="numberbox"><Link className="link-dark small text-decoration-none" to={`/verse/${response["n"]}/${i}`} ><div className="col numberbox">{i}</div></Link> </div>
                    );
                  }
                  return td;
                })()}
              </div>
              <div style={{ "position": "relative", "margin-bottom": "-35px" }} className="mt-3 arrowbutton"><a onClick={() => collapse(`${response["n"]}`)} className="btn rounded-circle fw-bold arrowbutton">⇣⇡</a></div>

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
      <div className="spinner-grow text-center" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    );

    let url2 = "/assets/json/title.json";

    const loadindex = async () => {
      const a = await getCacheData('content', url2);
      if (a) {
        biblechapters(a);
      }
      else {
        (async () => {
          await axios
            .get(url2)
            .then(function (response) {
              addDataIntoCache('content', url2, response);
              biblechapters(response);
            })
            .catch(function (error) {
              console.log(error);
            })
        })();
      }
    };
    loadindex();

    let url = "/assets/json/bible.json";
    const loadindex2 = async () => {
      const a = await getCacheData('content', url);
      if (a) {
      }
      else {
        (async () => {
          await axios
            .get(url)
            .then(function (response) {
              addDataIntoCache('content', url, response);
            })
            .catch(function (error) {
              console.log(error);
            })
        })();
      }
    };
    loadindex2();

  }, []);

  return (<>
    <section className="py-2 mb-5">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12">

            <section id="scroll-target">
              <div className="container-fluid my-2">
                <div className="row ">
                  <div className="container-fluid mt-3">
                    <div className="row g-3 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 justify-content-center">
                      {cards}
                    </div>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </section>
  </>);
}

export default Index;