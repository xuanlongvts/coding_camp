import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import { T_PRODUCT, T_PRODUCT_SHOW } from './type';
import { unitPay, changeRate } from './const';

const ListPro = ({ products, handleQuickBuy }: T_PRODUCT_SHOW) => {
    if (!products.length) {
        return null;
    }

    return (
        <Container sx={{ pt: 3, pb: 6 }} maxWidth="lg">
            <Grid container spacing={3}>
                {products.length &&
                    products.map((item: T_PRODUCT, _key: number) => {
                        const priceUsdc = changeRate(Number(item.price), unitPay.usdc);
                        return (
                            <Grid item key={_key} xs={12} sm={6} md={4}>
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <CardMedia
                                        component="img"
                                        sx={{ objectFit: 'contain' }}
                                        height="350"
                                        image={item.imgs.links[0]}
                                        alt={item.title}
                                        onClick={() => handleQuickBuy(unitPay.sol, item.id)}
                                    />
                                    <CardContent sx={{ flexGrow: 1 }} onClick={() => handleQuickBuy(unitPay.sol, item.id)}>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            {item.title}
                                        </Typography>
                                        <Typography>{item.description}</Typography>
                                    </CardContent>
                                    <CardActions disableSpacing>
                                        <Button size="medium" onClick={() => handleQuickBuy(unitPay.sol, item.id)}>
                                            <Typography variant="subtitle2">{Number(item.price).toFixed(1)}</Typography>&nbsp;-&nbsp;
                                            <Typography variant="caption">sol</Typography>
                                        </Button>
                                        <Button size="medium" onClick={() => handleQuickBuy(unitPay.usdc, item.id)}>
                                            <Typography variant="subtitle2">{priceUsdc}</Typography>&nbsp;-&nbsp;
                                            <Typography variant="caption">usdc</Typography>
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        );
                    })}
            </Grid>
        </Container>
    );
};

export default ListPro;
