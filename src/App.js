import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_KEY = "088bc001148bb2ea66feba13fa2c97b1";
const BASE = "https://api.themoviedb.org/3";
const IMG = "https://image.tmdb.org/t/p";

// ─── Styles ────────────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Rajdhani:wght@300;400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#070709;--surface:#0d0d11;--surface2:#13131a;--surface3:#1a1a23;
  --border:rgba(255,255,255,0.07);--border2:rgba(255,255,255,0.12);
  --gold:#c9a84c;--gold-light:#e8c97a;--gold-dim:rgba(201,168,76,0.12);--gold-dim2:rgba(201,168,76,0.22);
  --text:#e8e4dc;--text-muted:rgba(232,228,220,0.42);--text-mid:rgba(232,228,220,0.7);
  --green:#5ecb82;--amber:#e8a94c;--red:#e05555;
}
html{scroll-behavior:smooth;}
body{background:var(--bg);color:var(--text);font-family:'Rajdhani',sans-serif;min-height:100vh;overflow-x:hidden;}
::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-track{background:var(--bg);}::-webkit-scrollbar-thumb{background:rgba(201,168,76,0.3);border-radius:2px;}
.app{min-height:100vh;position:relative;}
.app::before{content:'';position:fixed;inset:0;background:radial-gradient(ellipse 70% 50% at 50% -5%,rgba(201,168,76,0.09) 0%,transparent 65%),radial-gradient(ellipse 40% 70% at 100% 80%,rgba(91,155,213,0.04) 0%,transparent 55%);pointer-events:none;z-index:0;}
.inner{position:relative;z-index:1;max-width:1280px;margin:0 auto;padding:0 28px 100px;}

/* Nav */
.nav{display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50;background:rgba(7,7,9,0.88);backdrop-filter:blur(16px);border-bottom:1px solid var(--border);margin:0 -28px;padding:18px 28px;}
.nav-logo{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:300;letter-spacing:0.06em;}
.nav-logo em{font-style:italic;color:var(--gold-light);}
.nav-tabs{display:flex;gap:4px;}
.nav-tab{background:none;border:1px solid transparent;color:var(--text-muted);font-family:'Rajdhani',sans-serif;font-size:11px;font-weight:500;letter-spacing:0.2em;text-transform:uppercase;padding:7px 14px;cursor:pointer;transition:all 0.2s;position:relative;}
.nav-tab:hover{color:var(--text);border-color:var(--border2);}
.nav-tab.active{color:var(--gold);border-color:var(--gold-dim2);background:var(--gold-dim);}
.nav-badge{position:absolute;top:-5px;right:-5px;background:var(--gold);color:#070709;font-size:9px;font-weight:700;border-radius:50%;width:16px;height:16px;display:flex;align-items:center;justify-content:center;}

/* Hero */
.hero{padding:60px 0 44px;text-align:center;}
.hero-eyebrow{font-size:10px;letter-spacing:0.4em;text-transform:uppercase;color:var(--gold);opacity:0.75;margin-bottom:14px;}
.hero-title{font-family:'Cormorant Garamond',serif;font-size:clamp(48px,8vw,90px);font-weight:300;line-height:0.88;letter-spacing:-0.02em;}
.hero-title em{font-style:italic;color:var(--gold-light);}
.divider{width:48px;height:1px;background:linear-gradient(90deg,transparent,var(--gold),transparent);margin:24px auto 18px;}
.hero-sub{font-size:13px;letter-spacing:0.18em;color:var(--text-muted);}

/* Search */
.search-wrap{display:flex;max-width:600px;margin:40px auto 0;}
.search-input{flex:1;background:var(--surface);border:1px solid var(--border);border-right:none;color:var(--text);font-family:'Rajdhani',sans-serif;font-size:15px;letter-spacing:0.05em;padding:14px 20px;outline:none;transition:border-color 0.25s,background 0.25s;}
.search-input::placeholder{color:var(--text-muted);}
.search-input:focus{background:var(--surface2);border-color:rgba(201,168,76,0.35);}
.search-btn{background:var(--gold);border:none;color:#070709;font-family:'Rajdhani',sans-serif;font-size:11px;font-weight:700;letter-spacing:0.25em;text-transform:uppercase;padding:14px 24px;cursor:pointer;transition:background 0.2s;}
.search-btn:hover{background:var(--gold-light);}

/* Filters */
.filters-bar{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-top:18px;justify-content:center;}
.filter-label{font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:var(--text-muted);}
.filter-select{background:var(--surface);border:1px solid var(--border);color:var(--text-mid);font-family:'Rajdhani',sans-serif;font-size:12px;letter-spacing:0.08em;padding:7px 28px 7px 12px;cursor:pointer;outline:none;transition:border-color 0.2s;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23c9a84c'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 10px center;}
.filter-select:focus{border-color:var(--gold-dim2);}
.clear-btn{font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:var(--text-muted);background:none;border:1px solid rgba(224,85,85,0.25);color:var(--red);cursor:pointer;padding:6px 12px;transition:all 0.2s;}
.clear-btn:hover{background:rgba(224,85,85,0.08);}

/* Section head */
.section-head{display:flex;align-items:center;gap:14px;margin:52px 0 16px;}
.section-line{flex:1;height:1px;background:var(--border);}
.section-title{font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:var(--text-muted);white-space:nowrap;}
.section-title span{color:var(--gold);}
.section-tag{font-size:9px;letter-spacing:0.2em;text-transform:uppercase;background:var(--gold-dim);border:1px solid var(--gold-dim2);color:var(--gold);padding:3px 8px;}

/* Trend tabs */
.trend-tabs{display:flex;gap:2px;margin-bottom:2px;}
.trend-tab{background:var(--surface);border:1px solid var(--border);color:var(--text-muted);font-family:'Rajdhani',sans-serif;font-size:10px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;padding:8px 16px;cursor:pointer;transition:all 0.2s;}
.trend-tab:hover{color:var(--text);}
.trend-tab.active{color:var(--gold);border-color:var(--gold-dim2);background:var(--gold-dim);}

/* Grid */
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(185px,1fr));gap:2px;}

/* Card */
.card{position:relative;background:var(--surface);overflow:hidden;cursor:pointer;animation:fadeUp 0.45s ease both;}
@keyframes fadeUp{from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:translateY(0);}}
.card:hover .card-img{transform:scale(1.06);filter:brightness(0.4);}
.card:hover .card-overlay{opacity:1;}
.card:hover .card-meta{transform:translateY(0);opacity:1;}
.card-poster{position:relative;aspect-ratio:2/3;overflow:hidden;background:var(--surface2);}
.card-img{width:100%;height:100%;object-fit:cover;display:block;transition:transform 0.5s ease,filter 0.5s ease;}
.no-poster{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;}
.no-poster-icon{font-size:32px;opacity:0.2;}
.no-poster-text{font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:var(--text-muted);opacity:0.4;}
.wl-indicator{position:absolute;top:10px;right:10px;background:var(--gold);color:#070709;font-size:9px;padding:2px 7px;letter-spacing:0.1em;font-weight:700;font-family:'Rajdhani',sans-serif;}
.card-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(7,7,9,0.97) 0%,rgba(7,7,9,0.5) 45%,transparent 100%);opacity:0;transition:opacity 0.35s;display:flex;flex-direction:column;justify-content:flex-end;padding:16px;}
.card-meta{transform:translateY(8px);opacity:0;transition:transform 0.35s ease,opacity 0.35s ease;}
.card-score-big{font-family:'Cormorant Garamond',serif;font-size:42px;font-weight:300;line-height:1;color:var(--gold-light);}
.card-score-label{font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:var(--text-muted);margin:3px 0 8px;}
.card-year-sm{font-size:11px;color:var(--text-muted);letter-spacing:0.06em;}
.card-actions{display:flex;gap:6px;margin-top:10px;}
.card-btn{flex:1;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.1);color:var(--text);font-family:'Rajdhani',sans-serif;font-size:9px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;padding:7px 4px;cursor:pointer;transition:all 0.2s;text-align:center;}
.card-btn:hover{background:rgba(255,255,255,0.13);}
.card-btn.wl{border-color:var(--gold-dim2);color:var(--gold);background:var(--gold-dim);}
.card-btn.wl:hover{background:var(--gold-dim2);}
.card-btn.wl-rem{border-color:rgba(224,85,85,0.3);color:var(--red);background:rgba(224,85,85,0.08);}
.card-strip{padding:11px 12px;border-top:1px solid var(--border);}
.card-title{font-family:'Cormorant Garamond',serif;font-size:14px;font-weight:400;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:5px;}
.card-bottom{display:flex;align-items:center;justify-content:space-between;}
.rating-badge{display:flex;align-items:center;gap:4px;font-size:13px;font-weight:600;}
.star{font-size:10px;}
.r-green{color:var(--green);}.r-amber{color:var(--amber);}.r-red{color:var(--red);}.r-none{color:var(--text-muted);}
.vote-count{font-size:10px;color:var(--text-muted);}

/* Modal */
.modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:100;display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn 0.2s ease;}
@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
.modal{background:var(--surface);border:1px solid var(--border2);max-width:860px;width:100%;max-height:90vh;overflow-y:auto;position:relative;animation:slideUp 0.3s ease;}
@keyframes slideUp{from{opacity:0;transform:translateY(24px);}to{opacity:1;transform:translateY(0);}}
.modal-close{position:absolute;top:14px;right:14px;z-index:10;background:rgba(0,0,0,0.65);border:1px solid var(--border2);color:var(--text);font-size:16px;width:34px;height:34px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background 0.2s;}
.modal-close:hover{background:rgba(224,85,85,0.25);}
.modal-hero{position:relative;height:300px;overflow:hidden;background:var(--surface2);}
.modal-bg-img{width:100%;height:100%;object-fit:cover;filter:brightness(0.3);}
.modal-hero-grad{position:absolute;inset:0;background:linear-gradient(to top,var(--surface) 0%,transparent 60%);}
.modal-hero-content{position:absolute;bottom:0;left:0;right:0;padding:24px 28px;display:flex;gap:20px;align-items:flex-end;}
.modal-poster{width:100px;flex-shrink:0;border:2px solid var(--border2);}
.modal-poster img{width:100%;display:block;}
.modal-title{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:300;line-height:1.1;margin-bottom:6px;}
.modal-tagline{font-size:12px;font-style:italic;color:var(--text-muted);margin-bottom:8px;}
.modal-chips{display:flex;flex-wrap:wrap;gap:5px;}
.modal-chip{font-size:9px;letter-spacing:0.2em;text-transform:uppercase;border:1px solid var(--border2);color:var(--text-muted);padding:3px 8px;}
.modal-body{padding:24px 28px;}
.modal-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:2px;margin-bottom:22px;}
.modal-stat{background:var(--surface2);padding:14px;text-align:center;}
.modal-stat-val{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:300;color:var(--gold-light);}
.modal-stat-label{font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:var(--text-muted);margin-top:3px;}
.overview-label{font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:var(--gold);margin-bottom:10px;}
.overview-text{font-size:14px;line-height:1.75;color:var(--text-mid);}
.modal-trailer{margin-top:22px;}
.trailer-label{font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:var(--text-muted);margin-bottom:10px;}
.modal-trailer iframe{width:100%;aspect-ratio:16/9;border:none;border:1px solid var(--border);}
.no-trailer{background:var(--surface2);aspect-ratio:16/9;display:flex;align-items:center;justify-content:center;color:var(--text-muted);font-size:11px;letter-spacing:0.15em;text-transform:uppercase;}
.modal-actions{display:flex;gap:8px;margin-top:22px;}
.modal-btn{flex:1;border:1px solid var(--border2);background:none;color:var(--text-mid);font-family:'Rajdhani',sans-serif;font-size:11px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;padding:12px;cursor:pointer;transition:all 0.2s;text-decoration:none;display:flex;align-items:center;justify-content:center;}
.modal-btn:hover{background:var(--surface2);}
.modal-btn.gold{border-color:var(--gold-dim2);color:var(--gold);background:var(--gold-dim);}
.modal-btn.gold:hover{background:var(--gold-dim2);}
.modal-btn.remove{border-color:rgba(224,85,85,0.3);color:var(--red);}
.modal-btn.remove:hover{background:rgba(224,85,85,0.08);}

/* Loading / empty */
.loading-row{display:flex;justify-content:center;gap:8px;padding:70px 0;}
.dot{width:5px;height:5px;background:var(--gold);border-radius:50%;animation:pulse 1.2s ease-in-out infinite;}
.dot:nth-child(2){animation-delay:0.2s;}.dot:nth-child(3){animation-delay:0.4s;}
@keyframes pulse{0%,100%{opacity:0.2;transform:scale(0.8);}50%{opacity:1;transform:scale(1.2);}}
.empty{text-align:center;padding:70px 20px;}
.empty-icon{font-size:48px;opacity:0.18;margin-bottom:16px;}
.empty-title{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:300;color:var(--text-muted);margin-bottom:6px;}
.empty-sub{font-size:12px;letter-spacing:0.12em;color:var(--text-muted);opacity:0.5;}

/* Footer */
.footer{margin-top:80px;padding-top:20px;border-top:1px solid var(--border);display:flex;align-items:center;justify-content:center;gap:10px;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:var(--text-muted);opacity:0.4;}
`;

const GENRES = [
  {id:28,name:"Action"},{id:12,name:"Adventure"},{id:16,name:"Animation"},
  {id:35,name:"Comedy"},{id:80,name:"Crime"},{id:18,name:"Drama"},
  {id:14,name:"Fantasy"},{id:27,name:"Horror"},{id:9648,name:"Mystery"},
  {id:10749,name:"Romance"},{id:878,name:"Sci-Fi"},{id:53,name:"Thriller"},
];
const YEARS = ["2025","2024","2023","2022","2021","2020","2010s","2000s","1990s","Classic"];

function rc(r){if(!r)return"r-none";if(r>=7)return"r-green";if(r>=5)return"r-amber";return"r-red";}
function fv(n){return n>=1000?(n/1000).toFixed(1)+"k":n||"–";}
function frt(m){if(!m)return"–";return`${Math.floor(m/60)}h ${m%60}m`;}

function Loader(){return<div className="loading-row"><div className="dot"/><div className="dot"/><div className="dot"/></div>;}

function MovieCard({movie,onOpen,watchlist,onToggleWL,delay=0}){
  const inWL=watchlist.some(m=>m.id===movie.id);
  return(
    <div className="card" style={{animationDelay:`${delay}ms`}}>
      <div className="card-poster">
        {movie.poster_path
          ?<img className="card-img" src={`${IMG}/w400${movie.poster_path}`} alt={movie.title}/>
          :<div className="no-poster"><div className="no-poster-icon">🎞</div><div className="no-poster-text">No Image</div></div>}
        {inWL&&<div className="wl-indicator">★ Saved</div>}
        <div className="card-overlay">
          <div className="card-meta">
            <div className="card-score-big">{movie.vote_average?movie.vote_average.toFixed(1):"–"}</div>
            <div className="card-score-label">TMDb Score</div>
            {movie.release_date&&<div className="card-year-sm">{movie.release_date.slice(0,4)}</div>}
            <div className="card-actions">
              <button className="card-btn" onClick={()=>onOpen(movie)}>Details</button>
              <button className={`card-btn ${inWL?"wl-rem":"wl"}`} onClick={()=>onToggleWL(movie)}>
                {inWL?"✕ Remove":"+ Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="card-strip">
        <div className="card-title">{movie.title}</div>
        <div className="card-bottom">
          <div className={`rating-badge ${rc(movie.vote_average)}`}><span className="star">★</span>{movie.vote_average?movie.vote_average.toFixed(1):"N/A"}</div>
          <div className="vote-count">{fv(movie.vote_count)}</div>
        </div>
      </div>
    </div>
  );
}

function Modal({movie,onClose,watchlist,onToggleWL}){
  const[detail,setDetail]=useState(null);
  const[trailer,setTrailer]=useState(null);
  const[loadingDetail,setLoadingDetail]=useState(true);
  const inWL=watchlist.some(m=>m.id===movie.id);

  useEffect(()=>{
    (async()=>{
      try{
        const[det,vid]=await Promise.all([
          axios.get(`${BASE}/movie/${movie.id}?api_key=${API_KEY}`),
          axios.get(`${BASE}/movie/${movie.id}/videos?api_key=${API_KEY}`),
        ]);
        setDetail(det.data);
        const yt=vid.data.results.find(v=>v.site==="YouTube"&&v.type==="Trailer");
        if(yt)setTrailer(yt.key);
      }catch(e){console.error(e);}
      setLoadingDetail(false);
    })();
  },[movie.id]);

  const d=detail||movie;

  return(
    <div className="modal-backdrop" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="modal-hero">
          {(d.backdrop_path||d.poster_path)&&
            <img className="modal-bg-img" src={`${IMG}/w1280${d.backdrop_path||d.poster_path}`} alt=""/>}
          <div className="modal-hero-grad"/>
          <div className="modal-hero-content">
            {d.poster_path&&<div className="modal-poster"><img src={`${IMG}/w300${d.poster_path}`} alt={d.title}/></div>}
            <div>
              <div className="modal-title">{d.title}</div>
              {detail?.tagline&&<div className="modal-tagline">"{detail.tagline}"</div>}
              <div className="modal-chips">
                {detail?.genres?.map(g=><span key={g.id} className="modal-chip">{g.name}</span>)}
              </div>
            </div>
          </div>
        </div>

        <div className="modal-body">
          <div className="modal-stats">
            {[
              {val:d.vote_average?d.vote_average.toFixed(1):"–",label:"Score"},
              {val:d.release_date?d.release_date.slice(0,4):"–",label:"Year"},
              {val:frt(detail?.runtime),label:"Runtime"},
              {val:detail?.vote_count?fv(detail.vote_count):"–",label:"Votes"},
            ].map(s=>(
              <div className="modal-stat" key={s.label}>
                <div className="modal-stat-val">{s.val}</div>
                <div className="modal-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {d.overview&&<>
            <div className="overview-label">Synopsis</div>
            <div className="overview-text">{d.overview}</div>
          </>}

          <div className="modal-trailer">
            <div className="trailer-label">Trailer</div>
            {loadingDetail?<Loader/>:trailer
              ?<iframe src={`https://www.youtube.com/embed/${trailer}`} allowFullScreen title="Trailer"/>
              :<div className="no-trailer">No trailer available</div>}
          </div>

          <div className="modal-actions">
            <button className={`modal-btn ${inWL?"remove":"gold"}`} onClick={()=>onToggleWL(movie)}>
              {inWL?"✕ Remove from Watchlist":"★ Add to Watchlist"}
            </button>
            {detail?.homepage&&(
              <a href={detail.homepage} target="_blank" rel="noreferrer" className="modal-btn">Official Site ↗</a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App(){
  const[tab,setTab]=useState("discover");
  const[search,setSearch]=useState("");
  const[movies,setMovies]=useState([]);
  const[trending,setTrending]=useState([]);
  const[trendPeriod,setTrendPeriod]=useState("day");
  const[loading,setLoading]=useState(false);
  const[trendLoading,setTrendLoading]=useState(true);
  const[hasSearched,setHasSearched]=useState(false);
  const[selected,setSelected]=useState(null);
  const[watchlist,setWatchlist]=useState(()=>{
    try{return JSON.parse(localStorage.getItem("cinevault_wl")||"[]");}catch{return[];}
  });
  const[filterGenre,setFilterGenre]=useState("");
  const[filterYear,setFilterYear]=useState("");
  const[filterRating,setFilterRating]=useState("");

  useEffect(()=>{localStorage.setItem("cinevault_wl",JSON.stringify(watchlist));},[watchlist]);

  const fetchTrending=useCallback(async(period)=>{
    setTrendLoading(true);
    try{
      const res=await axios.get(`${BASE}/trending/movie/${period}?api_key=${API_KEY}`);
      setTrending(res.data.results);
    }catch(e){console.error(e);}
    setTrendLoading(false);
  },[]);

  useEffect(()=>{fetchTrending(trendPeriod);},[trendPeriod]);

  const searchMovies=async()=>{
    if(!search.trim())return;
    setLoading(true);setHasSearched(true);
    try{
      const res=await axios.get(`${BASE}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(search)}`);
      setMovies(res.data.results);
    }catch(e){console.error(e);}
    setLoading(false);
  };

  const toggleWL=(movie)=>{
    setWatchlist(prev=>prev.some(m=>m.id===movie.id)?prev.filter(m=>m.id!==movie.id):[movie,...prev]);
  };

  const applyFilters=(list)=>list.filter(m=>{
    if(filterGenre&&!m.genre_ids?.includes(parseInt(filterGenre)))return false;
    if(filterYear){
      const yr=m.release_date?.slice(0,4);const y=parseInt(yr||0);
      if(filterYear==="2010s"&&(y<2010||y>2019))return false;
      else if(filterYear==="2000s"&&(y<2000||y>2009))return false;
      else if(filterYear==="1990s"&&(y<1990||y>1999))return false;
      else if(filterYear==="Classic"&&y>=1990)return false;
      else if(!["2010s","2000s","1990s","Classic"].includes(filterYear)&&yr!==filterYear)return false;
    }
    if(filterRating&&(m.vote_average||0)<parseFloat(filterRating))return false;
    return true;
  });

  const hasFilters=filterGenre||filterYear||filterRating;
  const displayMovies=applyFilters(movies);
  const displayTrending=applyFilters(trending);

  const Grid=({list,loading:l})=>{
    if(l)return<Loader/>;
    if(!list.length)return(
      <div className="empty">
        <div className="empty-icon">🎬</div>
        <div className="empty-title">{hasFilters?"No matches found":"Nothing here yet"}</div>
        <div className="empty-sub">{hasFilters?"Try adjusting your filters":"Search for a film to begin"}</div>
      </div>
    );
    return(
      <div className="grid">
        {list.map((m,i)=>(
          <MovieCard key={m.id} movie={m} delay={i*35} onOpen={setSelected} watchlist={watchlist} onToggleWL={toggleWL}/>
        ))}
      </div>
    );
  };

  return(
    <>
      <style>{css}</style>
      <div className="app">
        <div className="inner">

          <nav className="nav">
            <div className="nav-logo"><em>Cine</em>Vault</div>
            <div className="nav-tabs">
              <button className={`nav-tab ${tab==="discover"?"active":""}`} onClick={()=>setTab("discover")}>Discover</button>
              <button className={`nav-tab ${tab==="watchlist"?"active":""}`} onClick={()=>setTab("watchlist")} style={{position:"relative"}}>
                Watchlist
                {watchlist.length>0&&<span className="nav-badge">{watchlist.length}</span>}
              </button>
            </div>
          </nav>

          {tab==="discover"&&<>
            <div className="hero">
              <div className="hero-eyebrow">Curated Cinema</div>
              <h1 className="hero-title"><em>Discover</em><br/>Films</h1>
              <div className="divider"/>
              <p className="hero-sub">Search · Explore · Save</p>
              <div className="search-wrap">
                <input className="search-input" placeholder="Title, genre, director…" value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==="Enter"&&searchMovies()}/>
                <button className="search-btn" onClick={searchMovies}>Search</button>
              </div>
              <div className="filters-bar">
                <span className="filter-label">Filter:</span>
                <select className="filter-select" value={filterGenre} onChange={e=>setFilterGenre(e.target.value)}>
                  <option value="">All Genres</option>
                  {GENRES.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
                <select className="filter-select" value={filterYear} onChange={e=>setFilterYear(e.target.value)}>
                  <option value="">All Years</option>
                  {YEARS.map(y=><option key={y} value={y}>{y}</option>)}
                </select>
                <select className="filter-select" value={filterRating} onChange={e=>setFilterRating(e.target.value)}>
                  <option value="">Any Rating</option>
                  <option value="7">7+ ★ Great</option>
                  <option value="6">6+ ★ Good</option>
                  <option value="5">5+ ★ Average</option>
                </select>
                {hasFilters&&<button className="clear-btn" onClick={()=>{setFilterGenre("");setFilterYear("");setFilterRating("");}}>✕ Clear</button>}
              </div>
            </div>

            {hasSearched&&<>
              <div className="section-head">
                <div className="section-line"/>
                <div className="section-title">Results for "<span>{search}</span>" — <span>{displayMovies.length}</span></div>
                <div className="section-line"/>
              </div>
              <Grid list={displayMovies} loading={loading}/>
            </>}

            <div className="section-head" style={{marginTop:hasSearched?60:52}}>
              <div className="section-line"/>
              <div className="section-title"><span>Trending</span> Now</div>
              <div className="section-tag">Live</div>
              <div className="section-line"/>
            </div>
            <div className="trend-tabs">
              {["day","week"].map(p=>(
                <button key={p} className={`trend-tab ${trendPeriod===p?"active":""}`} onClick={()=>setTrendPeriod(p)}>
                  {p==="day"?"Today":"This Week"}
                </button>
              ))}
            </div>
            <Grid list={displayTrending} loading={trendLoading}/>
          </>}

          {tab==="watchlist"&&<>
            <div className="hero" style={{paddingBottom:28}}>
              <div className="hero-eyebrow">Your Collection</div>
              <h1 className="hero-title"><em>Watch</em><br/>list</h1>
              <div className="divider"/>
              <p className="hero-sub">{watchlist.length} {watchlist.length===1?"Film":"Films"} Saved</p>
            </div>
            {watchlist.length===0
              ?<div className="empty">
                  <div className="empty-icon">📽</div>
                  <div className="empty-title">Your watchlist is empty</div>
                  <div className="empty-sub">Hover a movie card and click "+ Save" to add films</div>
                </div>
              :<div className="grid">
                  {watchlist.map((m,i)=>(
                    <MovieCard key={m.id} movie={m} delay={i*35} onOpen={setSelected} watchlist={watchlist} onToggleWL={toggleWL}/>
                  ))}
                </div>}
          </>}

          <div className="footer">
            <span>Powered by TMDb</span><span style={{opacity:0.3}}>·</span><span>CineVault © {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>

      {selected&&<Modal movie={selected} onClose={()=>setSelected(null)} watchlist={watchlist} onToggleWL={toggleWL}/>}
    </>
  );
}