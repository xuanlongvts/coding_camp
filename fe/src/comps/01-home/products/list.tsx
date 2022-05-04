import Button from '@mui/material/Button';
// import CameraIcon from '@mui/icons-material/PhotoCamera';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import { T_PRODUCT } from './type';

const ListPro = ({ products }: { products: T_PRODUCT[] }) => {
    if (!products.length) {
        return null;
    }

    return (
        <Container sx={{ py: 3 }} maxWidth="lg">
            <Grid container spacing={2}>
                {products.length &&
                    products.map((item: T_PRODUCT, _key: number) => (
                        <Grid item key={item.id} xs={12} sm={6} md={4}>
                            <Card>
                                <CardMedia component="img" image={item.imgs.links[0]} alt="random" />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        {item.title}
                                    </Typography>
                                    <Typography>{item.description}</Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small">View</Button>
                                    <Button size="small">Edit</Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
            </Grid>
        </Container>
    );
};

export default ListPro;
