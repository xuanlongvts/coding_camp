import { styled } from '@mui/material/styles';
import Masonry from '@mui/lab/Masonry';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import { T_PRODUCT } from './type';
import { unitPay, changeRate } from './const';

const Item = styled(Card)(({ theme }) => ({
    ...theme.typography.body2,
    color: theme.palette.text.secondary,
}));

const BasicMasonry = ({ products, handleQuickBuy }: { products: T_PRODUCT[]; handleQuickBuy: (unit: string, price: number) => void }) => {
    if (!products.length) {
        return null;
    }

    return (
        <Container sx={{ py: 4 }} maxWidth="lg">
            <Masonry columns={{ xs: 1, sm: 2, md: 3 }} spacing={{ xs: 2, sm: 3, md: 4 }}>
                {products.map((item: T_PRODUCT, _key: number) => {
                    const priceUsdc = changeRate(Number(item.price), unitPay.sol);
                    return (
                        <Item key={item.id}>
                            <CardMedia component="img" image={item.imgs.links[0]} alt="random" />
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography gutterBottom variant="h5" component="h2">
                                    {item.title}
                                </Typography>
                                <Typography>{item.description}</Typography>
                            </CardContent>
                            <CardActions disableSpacing>
                                <Button size="medium" onClick={() => handleQuickBuy(unitPay.sol, Number(item.price))}>
                                    <Typography variant="subtitle2">{Number(item.price).toFixed(1)}</Typography>&nbsp;-&nbsp;
                                    <Typography variant="caption">sol</Typography>
                                </Button>
                                <Button size="medium" onClick={() => handleQuickBuy(unitPay.usdc, priceUsdc)}>
                                    <Typography variant="subtitle2">{priceUsdc}</Typography>&nbsp;-&nbsp;
                                    <Typography variant="caption">usdc</Typography>
                                </Button>
                            </CardActions>
                        </Item>
                    );
                })}
            </Masonry>
        </Container>
    );
};

export default BasicMasonry;
