import Head from 'next/head'
import useSWR, { useSWRInfinite } from 'swr'
import { createStyles, Theme, makeStyles, useTheme } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
import IconButton from '@material-ui/core/IconButton';
import OpenInNew from '@material-ui/icons/OpenInNew'
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { TransitionProps } from '@material-ui/core/transitions/transition';
import Slide from '@material-ui/core/Slide';
import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
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
      height: "auto",
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
const useDialogStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      position: 'relative',
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
  }),
);
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const apiUrl = 'http://localhost:8000'
export default function Home({ selectDataFromApi }) {
  const classes = useStyles();
  const appBarClasses = useAppBarStyles()
  const dialogClasses = useDialogStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const [showLoading, setShowLoading] = useState(false);
  const [dialogData, setDialogData] = useState({});
  const [selectData, setSelectData] = useState("");
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const getKey = (pageIndex, previousPageData) => {
    if (previousPageData && !previousPageData.length) return null;

    const url = `${apiUrl}/api/item/${selectData == "" ? selectDataFromApi[0]['ID'] : selectData}?offset=${pageIndex}&limit=50`;
    return url;
  };
  const { data, size, setSize, mutate } = useSWRInfinite(getKey, fetcher);
  // window.scrollTo({ top: 0, behavior: 'smooth' });
  useEffect(() => {
    window.onscroll = async () => {
      if (showLoading) return;
      if (
        window.innerHeight + window.scrollY - document.body.offsetHeight == 0
      ) {
        setShowLoading(true);
        await setSize(size + 1)
        setShowLoading(false);
      }
    };
  });
  if (!data) return <div></div>;

  return (
    <div>
            <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={appBarClasses.title}>
            女神牆
          </Typography>
          <FormControl style={{ minWidth: '30%', background: 'white' }}>
            <InputLabel>看版</InputLabel>
            <Select
              value={selectData == "" ? selectDataFromApi[0]['ID'] : selectData}
              onChange={async (event) => {
                const value = event.target.value as string;
                setSelectData(value)
                await setSize(1)
                await mutate();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              {
                selectDataFromApi && selectDataFromApi.map(a => {
                  return <MenuItem value={a.ID}>{a.Name}</MenuItem>
                })
              }
            </Select>
          </FormControl>
        </Toolbar>
      </AppBar>
   
    <React.Fragment>
      <CssBaseline />

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
                  return (<ImageListItem style={{ cursor: 'pointer' }} key={item.Avator} >
                    <img src={item.Avator} alt={item.Title} onClick={async () => {
                      const req = await fetch(`${apiUrl}/api/image/${item.ID}`)
                      const res = await req.json()
                      const tempDialogData = item
                      item['images'] = res
                      setDialogData(tempDialogData)
                      handleClickOpen()
                    }} />
                    <ImageListItemBar
                      title={item.Title}
                      position="top"
                      actionIcon={
                        <IconButton aria-label={`star ${item.Title}`} className={classes.icon}
                          onClick={() => {
                            window.open(item.Url)
                          }}
                        >
                          <OpenInNew />
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
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={dialogClasses.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={dialogClasses.title}>
              {dialogData['Title']}
            </Typography>
          </Toolbar>
        </AppBar>
        {
          <ImageList gap={1} className={classes.imageList} rowHeight={480} cols={matches ? 4 : 1}>
            {dialogData['images'] && dialogData['images'].map((item, index) => {
              return <ImageListItem style={{ cursor: 'pointer' }} key={index} onClick={() => {
                window.open(item.Url);

              }}>
                <img src={item.Url} alt={index} />
              </ImageListItem>
            }
            )}
          </ImageList>
        }
      </Dialog>
    </React.Fragment>
    </div>
  )
}
Home.getInitialProps = async (ctx) => {
  const res = await fetch(`${apiUrl}/api/webpage`)
  const json = await res.json()
  return { selectDataFromApi: json }
}