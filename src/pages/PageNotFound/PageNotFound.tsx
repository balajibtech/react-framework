/**
 * Title : Page not found page
 * Description : This component contains the content and image to indicate there is no page exist
 * Props: none
 */

import { Col, Row, Button } from "antd";
import { sessionStorageAccessor } from "../../utils/browserStorage";
import { PREV_ROUTE_STORAGE_KEY } from "../../routes/index.route";
import { useDispatch } from "react-redux";
import { setRoutePath } from "../../stores/Menu.store";
import "./PageNotFound.scss";
import PageNotFoundImg from "@/assets/images/common/page-not-found.webp";
// import { useRedirect } from "@/hooks/Redirect.hook";

const PageNotFound = () => {
    // --- Hooks ---
    // const { redirect } = useRedirect();
    const [LgetPreviousRoute, ,] = sessionStorageAccessor(
        PREV_ROUTE_STORAGE_KEY
    );
    const dispatch = useDispatch();

    //Rendure JSX
    return (
        <>
            <Row align="middle" justify="center" className="PageNotFound">
                <Col className="d-flex justify-center flex-wrap">
                    <Col className="cls-image-container">
                        {/* <Col className="image"></Col> */}
                        <img src={PageNotFoundImg} alt="Page not found" width={"100%"} height={"100%"} />
                    </Col>
                    <Col className="heading f-sbold w-100 text-black mb-10">
                        Page not found{" "}
                    </Col>
                    <Col
                        span={12}
                        className="cls-helpText fs-21 s-clr text-light mb-20 "
                    >
                        Sorry, this page doesn't exist. It may have been moved
                        or deleted. Try the homepage or search instead.
                    </Col>
                    {/* { LprevRoute &&  */}
                    <Col span={24}>
                        <Button
                            type="primary"
                            className="cls-primaryBtn"
                            onClick={() =>
                                dispatch(
                                    setRoutePath(LgetPreviousRoute() as string)
                                )
                            }
                        >
                            Back to previous page
                        </Button>
                    </Col>
                    {/* } */}
                </Col>
            </Row>
        </>
    );
};

export default PageNotFound;
