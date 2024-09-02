import React, { Children, forwardRef, useImperativeHandle } from 'react'
import Navbar from './Navbar'
import SideBar from './SideBar'
import Footer from './Footer'
import Header from './Header'
import { useRef } from 'react'

const Template = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    refreshCountBill() {
      if(templateRef.current){
        templateRef.current.refreshCountBill();
      }
    }
  }))

  const templateRef = useRef();
  return (
    <div className="wrapper">
      <Navbar/>
      <SideBar ref={templateRef}/>
      <div className="content-wrapper pt-3">
        <section className="content">
          {props.children}
        </section>
      </div>
      <Footer/>
    </div>
  )
})

export default Template
// function Template(props, ref) {
//   useImperativeHandle(ref,() => {

//   })
//   return (
//     <div className="wrapper">
//         <Navbar/>
//         <SideBar/>
//         <div className="content-wrapper pt-3">
//              <section className="content">
//                 {props.children}
//              </section>
//         </div>
//         <Footer/>
//     </div>
//   )
// }

// export default Template