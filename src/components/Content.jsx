import { Link, useParams, useLocation } from "react-router-dom";
import { useState, useEffect, useRef, React } from "react";
import axios from "axios";


function Content() {
  let params = useParams();
  const location = useLocation();
  const [cards, setCards] = useState([]);
  const [title, setTitle] = useState([]);
  const [chapter, setChapter] = useState();

  async function speak(a, index) {

    window.speechSynthesis.cancel();
    let sentences =[];
    for(var i = index; i< JSON.parse(chapter).length ; i++){
      sentences.push(JSON.parse(chapter)[i].t);
    }
    for (var i = 0; i < sentences.length; i++) {
       getNextAudio(sentences[i]);
    }

    async function getNextAudio(sentence) {
      console.log(sentence);
      let audio = new SpeechSynthesisUtterance(sentence);
      audio.lang = "ml";
      window.speechSynthesis.speak(audio);

      return new Promise(resolve => {
        audio.onend = resolve;
      });
    } 


    
    // for(var i = index; i<= JSON.parse(chapter).length ; i++){
    //   console.log(JSON.parse(chapter)[i].t);
    //   var synth = window.speechSynthesis;
    //   synth.cancel();
    //   var utterThis = new SpeechSynthesisUtterance(a);
    //   utterThis.lang = "ml";
    //   synth.speak(utterThis);
    // }
  
    
    
  }

  useEffect(() => {
    setCards(
      <div class="spinner-grow text-center" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    );

    let url = "/assets/json/bible.json"; let url2 = "/assets/json/title.json";
    let b = [];
    
    (async () => {
      await axios
        .get(url2)
        .then(function (response) {

          var r = response.data.filter(function (obj) {
            return (obj.n == params.book);
          });

          setTitle(
            <div><div><h3 className=""><span className="text-primary fw-bold"><Link className="text-decoration-none" to={`/verse/${r[0].n}/1`} >{r[0].bm}</Link></span> - അദ്ധ്യായം {params.chapter}</h3></div>
              <div className="row row-cols-auto mt-3 justify-content-center">
                {(() => {
                  let td = [];
                  for (let i = 1; i <= r[0].c; i++) {
                    td.push(
                      <div key={i} className="numberbox"><Link className="link-dark small text-decoration-none" to={`/verse/${params.book}/${i}`} ><div className="col numberbox">{i}</div></Link> </div>
                    );
                  }
                  return td;
                })()}
              </div>

            </div>

          );

        })
        .catch(function (error) {
          console.log(error);
        })
        .then(function () { });
    })();

    (async () => {
      await axios
        .get(url)
        .then(function (response) {

          var r = response.data.filter(function (obj) {
            return (obj.b == params.book && obj.c == params.chapter);
          });

          b = []; // clearing array first
          setChapter(JSON.stringify(r));
          r.forEach((response,index) => {
            b.push(
              <div className="col mb-2 pushdata" id={`v-${response["v"]}`}>
                <div className="shadow-sm card ">
                  <div className="card-body col-12">
                    <div className="row row-col-3 g-2">
                      <div className="col-auto"><span className="fw-bold">{response["v"]}.</span></div>
                      <div className="col text-left">{response["t"]}</div>
                      <div className="col-auto text-right ml-auto my-auto"><div style={{ "position": "relative", "margin-right": "-35px" }} className="arrowbutton"><a onClick={e => speak(response["t"],index)} className="btn btn-small rounded-circle fw-bold arrowbutton"><img src="/assets/images/play.svg"/></a></div>
                      </div>
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

        })
        .catch(function (error) {
          console.log(error);
        })
        .then(function () { });
    })();

  }, [location,chapter]);
  return (
    <section className="py-2 mb-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <section id="scroll-target">
              <div className="container my-2">
                <div className="row row-cols-1 justify-content-center">
                  <div className="text-center mb-2">{title}</div>
                  {cards}

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