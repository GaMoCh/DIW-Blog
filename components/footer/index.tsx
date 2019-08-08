import { FC } from "react";
import { Grid, GridRow, GridColumn, Header } from "semantic-ui-react";

const FooterComponent: FC = () => {
  return (
    <Grid as="footer" celled="internally">
      <GridRow color="black">
        <GridColumn textAlign="center">
          <Header as="span" color="violet">
            Código disponível em:&nbsp;
          </Header>
          <Header as="a" color="blue" href="https://github.com/GaMoCh/DIW_Blog">
            GaMoCh/DIW_Blog
          </Header>
        </GridColumn>
      </GridRow>
    </Grid>
  );
};

export default FooterComponent;
