import React from 'react'

const header = ({toggleModel,numOfContacts}) => {
  return (
        <header className='header'> 
            <div className='container'>
                    <h3>Contact List ({numOfContacts})</h3>
                    <button onClick={()=>toggleModel(true)} className='btn'>
                        <i className='bi bi-plus-square'></i>Add new contatc
                        </button>
            </div>
        </header>
)
}

export default header