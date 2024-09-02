import React from 'react'

export default function Header(props) {
    return (
        <div>
            <section className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                            <h1>{props.title}</h1>
                        </div>
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item"><a href="#">{props.breadMain}</a></li>
                                <li className="breadcrumb-item active">{props.breadActive}</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
