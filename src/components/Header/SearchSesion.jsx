import React from 'react'
import { Search } from 'lucide-react'

function SearchSection({setBuscar}) {
  return (
    <section>
        <div className="Search">
          <Search className="icon" />
          <input
            type="search"
            placeholder="Empieza a buscar"
            id="searchinput"
            onChange={(e) => setBuscar(e.target.value)}
          />
        </div>
      </section>
  )
}

export default SearchSection