import { Link, useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";


function Search() {
  let params = useParams();
  const location = useLocation();
  const [cards, setCards] = useState([]);
  const [title, setTitle] = useState([]);
  

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
            <div><div><h3 className=""><span className="text-primary fw-bold">{r[0].bm}</span> - അദ്ധ്യായം {params.chapter}</h3></div>
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
          r.forEach((response) => {
            b.push(
              <div className="col mb-2 pushdata" id={`v-${response["v"]}`}>
                <div className="shadow-sm card flex-row flex-wrap">
                  <div className="card-body">
                    <div className="row row-col-2">
                      <div className="col-auto"><span className="fw-bold">{response["v"]}.</span></div>
                      <div className="col">{response["t"]}</div>
                    </div>


                  </div>
                </div>
              </div>
            );
          });
          setCards(b);
          if(params.verse && b.length >= params.verse ){
          console.log("inside");
          
          }

        })
        .catch(function (error) {
          console.log(error);
        })
        .then(function () { });
    })();

  }, [location]);
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

export default Search;