import { Link, useSearchParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

function Header(props) {
    const [input, setInput] = useState(props?.value ?? '');
    const [searchParams, setSearchParams] = useSearchParams();
    const regInput = useRef();

    useEffect(()=>{
       if(searchParams.get("q") == null){
        setInput(regInput.current.value);
       }else{
        setInput(searchParams.get("q"));
       }
    },[searchParams]);

    return (
        <>
         <nav className="navbar navbar-expand-sm navbar-dark sticky-top" style={{backgroundColor:"#344955"}}>
                <div className="container justify-content-center mb-2">
                    <Link className="navbar-brand" to="/"><img loading="lazy" src="/assets/images/ml-bible.webp" alt="ജീവന്റെവചനം മലയാളം" style={{height:"55px",marginTop: "-5px"}} /></Link>
                    <form className="form-inline input-group" action="/search"><input ref={regInput} onInput={e => setInput(e.target.value)} value={input} className="form-control" type="search" placeholder="മലയാളത്തിൽ വേദവാക്യങ്ങൾ തിരയുക..." aria-label="Search" name="q" required="" />
                    <Link type="button" to={`/search?q=`+input} className="btn btn-light text-body"><svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-search blink_me" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.442 10.442a1 1 0 0 1 1.415 0l3.85 3.85a1 1 0 0 1-1.414 1.415l-3.85-3.85a1 1 0 0 1 0-1.415z"></path><path fill-rule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"></path></svg></Link>
                    </form>
                </div>
            </nav>
        </>
    );
}

export default Header;