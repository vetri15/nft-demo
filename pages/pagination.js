import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'

export default function Pagination(props) {

  const {currentPageStart, totalNFTs, selectAPage} = props;
  const startTokens = () => {
    let pageTokens = [];
    let n = Math.ceil(totalNFTs / 10);
    for(let i = 0 ; i < n ; i++){
      let pageNumber = i;
      let isVisible = isFirst(pageNumber) || isLast(pageNumber,n) || isNearSelected(pageNumber);
      if(isVisible){
        pageTokens.push(i);
      }
    }
    pageTokens = addSpacers(pageTokens);
    return pageTokens;
  }

  const addSpacers = (pageTokens) => { 
    let n = pageTokens.length;
    let i = 0;
    let spacecount = 0;
    while(i < n-1+spacecount){
      if(pageTokens[i]+1 != pageTokens[i+1]){
        pageTokens.splice(i+1,0,-3);
        i++;
        spacecount++;
      }
      i++;
    }
    return pageTokens;
  }

  const isFirst = (pageNumber) => {
    return pageNumber == 0;
  }

  const isLast = (pageNumber,n) => {
    return pageNumber == (n - 1);
  }

  const isNearSelected = (pageNumber) => {
    // currentPageStart
    if(pageNumber >= currentPageStart - 2 && pageNumber <= currentPageStart + 2){
      return true;
    }
    return false;
  }

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{(currentPageStart)*10}</span> to <span className="font-medium">{(currentPageStart+1)*10}</span> of{' '}
            <span className="font-medium">{totalNFTs}</span> results
          </p>
        </div>
        <span>&emsp;</span>
        <div>
          <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md shadow-sm">
            <a
              onClick={()=> selectAPage(currentPageStart - 1)}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon aria-hidden="true" className="size-5" />
            </a>
            {/* NORMAL -> inline-flex items-center relative px-4 py-2 font-semibold text-sm text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0 
                SELECTED -> inline-flex items-center relative px-4 py-2 font-semibold text-sm z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600
                TRIPLE DOT -> relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0*/ }
            {/* Current: "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600", Default: "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0" */}
            {
              startTokens().map(page => {
                let normal = "inline-flex items-center relative px-4 py-2 font-semibold text-sm text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0";
                let selected = "inline-flex items-center relative px-4 py-2 font-semibold text-sm z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600";
                let spacer = "relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0";
                if(page < 0){
                  return(<span key={Math.random()} className={spacer}>...</span>)
                }else if(page == currentPageStart){
                  return(<a key={Math.random()} className={selected} onClick={()=> selectAPage(page)}>{page+1}</a>)
                }else{
                  return(<a key={Math.random()} className={normal} onClick={()=>selectAPage(page)}>{page+1}</a>)
                }
              })
            }
            <a
              onClick={()=> selectAPage(currentPageStart + 1)}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon aria-hidden="true" className="size-5" />
            </a>
          </nav>
        </div>
      </div>
    </div>
  )
}
