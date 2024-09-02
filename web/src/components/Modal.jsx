function Modal(props) {
    let modalSize = 'modal-dialog';

    if (props.modalSize) {
        modalSize += ' ' + props.modalSize;
    }
    const handleClose = async (e) => {
        $(`#${props.id}`).modal('hide'); 
    }
    
    return (
        <>
            {/* <div className="modal" id={props.id} data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
                aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className={modalSize}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">{props.title}</h1>
                            <button id='btnModalClose' type="button" className="btn-close btnClose" data-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {props.children}
                        </div>
                    </div>
                </div>
            </div> */}

            <div className="modal fade  " id={props.id} tabIndex="-1" role="dialog" aria-labelledby="modal-title"  data-bs-keyboard="false" aria-hidden="true" >
                <div className={modalSize} role="document">
                    <div className="modal-content border-primary">
                        <div className="modal-header ">
                            <h5 className="modal-title " id="modal-title">{props.title}</h5>
                            <button id="btnModalClose" type="button" className="close btnClose" data-dismiss="modal" aria-label="Close"  onClick={handleClose} >
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {props.children}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Modal