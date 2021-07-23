import Head from 'next/head'
import useSWR, { useSWRInfinite } from 'swr'
import { createStyles, Theme, makeStyles, useTheme } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
import IconButton from '@material-ui/core/IconButton';
import StarBorderIcon from '@material-ui/icons/StarBorder'
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
const fetcher = (url: RequestInfo) => fetch(url).then(r => r.json())
const useAppBarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }),
);
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.paper,
    },
    imageList: {
      // width: 500,
      height: "auto",
      // Promote the list into its own layer in Chrome. This cost memory, but helps keep FPS high.
      // transform: 'translateZ(0)',
    },
    titleBar: {
      background:
        'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
        'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },
    icon: {
      color: 'white',
    },
  }),
);
export default function Home(props) {
  const classes = useStyles();
  const appBarClasses = useAppBarStyles()
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  console.log(matches)
  const [showLoading, setShowLoading] = useState(false);
  const getKey = (pageIndex, previousPageData) => {
    if (previousPageData && !previousPageData.length) return null;
    const url = `http://localhost:8000/api/item/EDB7DCF0-FF4E-433B-8AD2-57454859B9F9?offset=${pageIndex}&limit=50`;
    return url;
  };
  const { data, size, setSize } = useSWRInfinite(getKey, fetcher);
  useEffect(() => {
    window.onscroll = async () => {
      if (showLoading) return;
      console.log(window.innerHeight + window.scrollY - document.body.offsetHeight)
      if (
        window.innerHeight + window.scrollY - document.body.offsetHeight == 0
      ) {
        setShowLoading(true);
        await setSize(size +1)
        console.log("page size ",size)
        setShowLoading(false);
      }
    };
  }, [setSize, size]);
  if (!data) return <div></div>;

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={appBarClasses.title}>
            女神牆
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl">
        <div>
          <Head>
            <title>女神牆</title>
            <link rel="icon" href="/favicon.ico" />
            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
          </Head>
          <div className={classes.root}>
            <ImageList gap={1} className={classes.imageList} rowHeight='auto' cols={matches ? 4 : 1}>
              {data.map((lists, index) => {
                return lists.map(item => {
                  return (<ImageListItem key={item.Avator}>
                    <img src={item.Avator} alt={item.Title} />
                    <ImageListItemBar
                      title={item.Title}
                      position="top"
                      actionIcon={
                        <IconButton aria-label={`star ${item.Title}`} className={classes.icon}>
                          <StarBorderIcon />
                        </IconButton>
                      }
                      actionPosition="left"
                      className={classes.titleBar}
                    />
                  </ImageListItem>)
                })


              }
              )}
            </ImageList>
          </div>
        </div>
      </Container>
    </React.Fragment>

  )
}
