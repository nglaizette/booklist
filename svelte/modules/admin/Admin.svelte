<script lang="ts">
  import { Tabs, TabHeaders, TabHeader, TabContents, TabContent } from "app/components/layout/tabs/index";

  import ajaxUtil from "util/ajaxUtil";
  import { getLoginStatus } from "util/loginStatus";
  import { graphqlSyncAndRefresh } from "util/graphqlHelpers";

  import SummaryQuery from "gql/admin/bookSummaryCoverInfo.graphql";
  import CoverManager from "./book-covers/CoverManager.svelte";

  graphqlSyncAndRefresh("BookSummary", SummaryQuery);
</script>

<section>
  <Tabs defaultTab={"covers"} localStorageName="admin-tab">
    <TabHeaders>
      <TabHeader tabName="covers" text="Recommendation Covers" />
      <TabHeader tabName="test-scan" text="Test Scan" />
    </TabHeaders>

    <TabContents>
      <TabContent style={{ minHeight: "150px" }} tabName="covers"><CoverManager /></TabContent>
      <TabContent style={{ minHeight: "150px" }} tabName="test-scan">
        <button
          class="btn btn-xs margin-left"
          on:click={() => {
            const wait = ms => new Promise(res => setTimeout(res, ms));
            (async function () {
              const delay = 250;
              for (let i = 0; i < 1; i++) {
                ajaxUtil.postWithCors(process.env.SCAN_BOOK, { isbn: "0198788606", ...getLoginStatus() });
                await wait(delay);
                ajaxUtil.postWithCors(process.env.SCAN_BOOK, { isbn: "9780618918249", ...getLoginStatus() });
                await wait(delay);
                ajaxUtil.postWithCors(process.env.SCAN_BOOK, { isbn: "9798577932152", ...getLoginStatus() });
                await wait(delay);
                ajaxUtil.postWithCors(process.env.SCAN_BOOK, { isbn: "9780553380163", ...getLoginStatus() });
                await wait(delay);
                ajaxUtil.postWithCors(process.env.SCAN_BOOK, { isbn: "9780553380163", ...getLoginStatus() });
                await wait(delay);
                ajaxUtil.postWithCors(process.env.SCAN_BOOK, { isbn: "039330700X", ...getLoginStatus() });
                await wait(delay);
                ajaxUtil.postWithCors(process.env.SCAN_BOOK, { isbn: "9780393308181", ...getLoginStatus() });
                await wait(delay);
                ajaxUtil.postWithCors(process.env.SCAN_BOOK, { isbn: "334455", ...getLoginStatus() });
                await wait(delay);
                ajaxUtil.postWithCors(process.env.SCAN_BOOK, { isbn: "0142003344", ...getLoginStatus() });
                await wait(delay);
                ajaxUtil.postWithCors(process.env.SCAN_BOOK, { isbn: "0465072704", ...getLoginStatus() });
                await wait(delay);
              }
            })();
          }}
        >
          TEST
        </button>
      </TabContent>
    </TabContents>
  </Tabs>
</section>
