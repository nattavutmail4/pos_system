function Modal(props) {
    let modalSize = 'modal-dialog';
    let icon = 'fa fa-file-alt'
    if (props.modalSize) {
        modalSize += ' ' + props.modalSize;
    }
    if(props.icon) {
        icon += ' ' + props.icon;
    }
    const handleClose = async (e) => {
        $(`#${props.id}`).modal('hide'); 
    }
    
    return (
        <>
            <div className="modal fade  " id={props.id} tabIndex="-1" role="dialog" aria-labelledby="modal-title"  data-bs-keyboard="false" aria-hidden="true" >
                <div className={modalSize} role="document">
                    <div className="modal-content border-primary">
                        <div className="modal-header ">
                            <h5 className="modal-title " id="modal-title"><i className={icon}></i><span className="me-2"></span>{props.title}</h5>
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