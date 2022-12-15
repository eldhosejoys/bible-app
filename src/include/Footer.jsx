import { Link } from "react-router-dom";

function Footer() {
    return (<>
        <footer className="bg-dark py-4 mt-auto">
  <div className="container px-5">
    <div className="row  justify-content-center flex-column flex-sm-row">
      <div className="col-auto">
        <div className="small m-0 text-white">©{(new Date().getFullYear())} മലയാളം സത്യവേദം</div>
      </div>
      <div className="col-auto">
        {/* <Link className="link-light small" to="/">Home</Link> */}
      </div>
    </div>
  </div>
</footer>
{/* <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.2/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.1.3/js/bootstrap.bundle.min.js" ></script> */}
</> );
}

export default Footer;