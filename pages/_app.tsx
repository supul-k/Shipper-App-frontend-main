import "../styles/globals.css";
import "../styles/home.css";
import "../styles/auth.css";
import "../styles/header.css";
import { getServerCookie } from "../utils/cookie";
import type { AppProps } from "next/app";
import HeaderComponent from "../components/HeaderComponent";
import { useRouter } from "next/router";
import { Provider } from "react-redux";
import "semantic-ui-css/semantic.min.css";
import createStore from "../store/configureStore";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const store = createStore({});

  const renderComponent = () => {
    if (
      router.pathname !== "/signin" &&
      router.pathname !== "/print_nra" &&
      router.pathname !== "/print_booking" &&
      router.pathname !== "/print_dock" &&
      router.pathname !== "/print_poa" &&
      router.pathname !== "/print_invoice"
    ) {
      return (
        <div>
          <HeaderComponent />
        </div>
      );
    }
  };

  return (
    <Provider store={store}>
      {renderComponent()}
      <Component {...pageProps} />
    </Provider>
  );
}

MyApp.getInitialProps = async (appctx: any) => {
  const { ctx }: any = appctx;

  let isAuth: boolean = false;
    if(ctx.res.writeHead) {
      const hasHeader = ctx.req ? true : false;
      if (hasHeader) {
        if (ctx.req.headers.cookie !== undefined) {
          const result = getServerCookie(ctx.req.headers.cookie);

          isAuth = result !== "" && true;
          if (ctx.req.url === "/signin") {
            ctx.res.writeHead(302, { Location: `/` }).end();
          }
        } else {

          const splitLink: string = ctx.req.url.split("?");
          const link1 = splitLink[0];
          const link2 = splitLink[1];
          if (link1 !== "/signin") {
            if (link2 === "session=expired") {
              ctx.res.writeHead(302, { Location: `${link1}?${link2}` }).end();
            } else {
              ctx.res.writeHead(302, { Location: `/signin` }).end();
            }
          }
        }
      }

      return { pageProps: { isAuth } };
    } else {

       return { pageProps: { isAuth:{} } };
    }



};
export default MyApp;
