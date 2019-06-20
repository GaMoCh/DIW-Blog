import { Component, MouseEvent } from "react";
import { Dispatch, bindActionCreators } from "redux";
import { connect } from "react-redux";

import TextEditorComponent from "../textEditor";

import { ApplicationState } from "../../store/index";
import { add, edit } from "../../store/ducks/posts/actions";
import { Props, State, OwnProps } from "./types";
import {
  AddPostContainer,
  AlignedInCenter,
  AuthorContainer,
  BlueInput,
  NoMargin,
  LikesCounterContainer,
  PaddingVertically,
  Paragraph,
  PostsContainer,
  PostDataContainer,
  Title,
  VerticallySpaced,
  VioletText
} from "./styles";

import {
  Container,
  Comment,
  Header,
  Segment,
  Divider,
  Button,
  Icon,
  Image,
  Label,
  Transition,
  ButtonProps,
  CommentContent,
  CommentAuthor,
  CommentText,
  CommentMetadata,
  Statistic,
  StatisticValue,
  StatisticLabel,
  CommentGroup,
  CommentAvatar,
  Popup,
  PopupHeader,
  PopupContent
} from "semantic-ui-react";

class PostsComponent extends Component<Props, State> {
  textEditorComponentRefs: TextEditorComponent[];

  constructor(props: Props) {
    super(props);

    this.state = {
      likeIconVisibility: true
    };

    this.textEditorComponentRefs = [];

    this.createMarkup = this.createMarkup.bind(this);
    this.setTextEditorComponentRef = this.setTextEditorComponentRef.bind(this);
    this.toggleLikeIconVisibility = this.toggleLikeIconVisibility.bind(this);
    this.checkIfLoggedUserLikedThePost = this.checkIfLoggedUserLikedThePost.bind(this);
    this.handleLikeButtonClick = this.handleLikeButtonClick.bind(this);
    this.handleSendCommentButtonClick = this.handleSendCommentButtonClick.bind(this);
    this.showAddPostModal = this.showAddPostModal.bind(this);
    this.getDate = this.getDate.bind(this);
    this.getHour = this.getHour.bind(this);
  }

  componentWillReceiveProps() {
    this.textEditorComponentRefs = [];
  }

  createMarkup(markupString: string) {
    return { __html: markupString };
  }

  setTextEditorComponentRef(ref: TextEditorComponent) {
    this.textEditorComponentRefs.push(ref);
  }

  toggleLikeIconVisibility() {
    this.setState(({ likeIconVisibility }) => ({
      likeIconVisibility: !likeIconVisibility
    }));
  }

  checkIfLoggedUserLikedThePost(id: number) {
    const { loggedId, posts, users } = this.props;
    const loggedUsername = users[loggedId].username;
    const listOfUsersWhoLikedThisPost = posts[id].likes.users;
    const loggedUserLikedIt =
      listOfUsersWhoLikedThisPost.findIndex(username => username === loggedUsername) !== -1;

    return loggedUserLikedIt;
  }

  handleLikeButtonClick(event: MouseEvent, { id }: ButtonProps) {
    const { edit, loggedId, posts, users } = this.props;
    const loggedUsername = users[loggedId].username;
    const getLoggedUsernameIndexFromArray = (array: string[], loggedUsername: string) =>
      array.findIndex(username => username === loggedUsername);

    event.preventDefault();

    if (this.checkIfLoggedUserLikedThePost(id)) {
      posts[id].likes.amount--;
      posts[id].likes.users.splice(
        getLoggedUsernameIndexFromArray(posts[id].likes.users, loggedUsername),
        1
      );
    } else {
      posts[id].likes.amount++;
      posts[id].likes.users.push(loggedUsername);
    }

    edit(posts);
    this.setState({});
  }

  handleSendCommentButtonClick(event: MouseEvent, { id }: ButtonProps) {
    const { edit, loggedId, posts, users } = this.props;
    const textEditor = this.textEditorComponentRefs[id];
    const loggedUser = (({ username, image }) => ({ username, image }))(users[loggedId]);

    event.preventDefault();

    posts[id].comments.push({
      author: loggedUser,
      date: new Date().toString(),
      text: textEditor.getHTMLCode()
    });

    edit(posts);
    this.textEditorComponentRefs[id].clearValue();
    this.setState({});
  }

  showAddPostModal(event: MouseEvent) {
    const { showAddPostModal } = this.props;
    event.preventDefault();
    showAddPostModal();
  }

  getDate(date: string) {
    const newDate = new Date(date);
    const pad = (number: number) => (number < 10 ? `0${number}` : number);

    return [pad(newDate.getDate()), pad(newDate.getMonth() + 1), newDate.getFullYear()].join("/");
  }

  getHour(date: string) {
    const newDate = new Date(date);
    const pad = (number: number) => (number < 10 ? `0${number}` : number);

    return [pad(newDate.getHours()), pad(newDate.getMinutes() + 1)].join(":");
  }

  render() {
    const { loggedId, posts, users } = this.props;
    const { likeIconVisibility } = this.state;
    const userIsLogged = loggedId != -1;
    const isWriter = userIsLogged ? users[loggedId].isWriter : false;
    const sortedPosts = posts.sort(
      (postA, postB) => Date.parse(postB.date) - Date.parse(postA.date)
    );

    return (
      <PostsContainer>
        {isWriter ? (
          <Container as={AddPostContainer}>
            <Button
              circular
              icon
              color="violet"
              labelPosition="left"
              onClick={this.showAddPostModal}
            >
              <Icon name="add" />
              Adicionar postagem
            </Button>
          </Container>
        ) : null}

        {sortedPosts.map((post, postKey) => (
          <Container as="section" key={postKey}>
            <Segment as={PaddingVertically}>
              <Container as="article" text textAlign="justified">
                <Header as={Title} textAlign="center">
                  {post.title}
                </Header>
                <Divider as="hr" section />
                <PostDataContainer>
                  <AuthorContainer>
                    <Image src={post.author.image} avatar />
                    <Header as={NoMargin}>{post.author.username}</Header>
                  </AuthorContainer>
                  <Header as={NoMargin}>{this.getDate(post.date)}</Header>
                </PostDataContainer>
                <Divider as="hr" section />
                <Segment>
                  <Image fluid rounded src={post.image} />
                </Segment>
                <Segment>
                  <Paragraph dangerouslySetInnerHTML={this.createMarkup(post.text)} />
                </Segment>
                <Divider as="hr" />
                <LikesCounterContainer>
                  <Popup
                    disabled={post.likes.users.length === 0}
                    position="bottom center"
                    hideOnScroll
                    trigger={
                      <Statistic as={VioletText}>
                        <StatisticValue>
                          <Icon color="blue" name="thumbs up outline" />
                          {post.likes.amount === 0 ? null : post.likes.amount}
                        </StatisticValue>
                        <StatisticLabel as="span">
                          {post.likes.amount === 0
                            ? "Ninguém curtiu"
                            : post.likes.amount === 1
                            ? "Pessoa curtiu"
                            : "Pessoas curtiram"}
                        </StatisticLabel>
                      </Statistic>
                    }
                  >
                    <PopupHeader>Postagem curtida por:</PopupHeader>
                    <PopupContent>
                      {post.likes.users.sort().map((user, key) => (
                        <div key={key}>{user}</div>
                      ))}
                    </PopupContent>
                  </Popup>
                  {userIsLogged ? (
                    <Button
                      as="div"
                      labelPosition="right"
                      id={postKey}
                      onClick={this.handleLikeButtonClick}
                    >
                      <Button
                        color={this.checkIfLoggedUserLikedThePost(postKey) ? "violet" : "blue"}
                        onMouseEnter={this.toggleLikeIconVisibility}
                      >
                        <Transition animation="pulse" visible={likeIconVisibility}>
                          <Icon
                            name={
                              this.checkIfLoggedUserLikedThePost(postKey)
                                ? "thumbs down"
                                : "thumbs up"
                            }
                          />
                        </Transition>
                        {this.checkIfLoggedUserLikedThePost(postKey) ? "Descurtir" : "Curtir"}
                      </Button>
                      <Label
                        as="span"
                        basic
                        color={this.checkIfLoggedUserLikedThePost(postKey) ? "violet" : "blue"}
                        pointing="left"
                      >
                        {this.checkIfLoggedUserLikedThePost(postKey) ? "-1" : "+1"}
                      </Label>
                    </Button>
                  ) : null}
                </LikesCounterContainer>
                <Divider as="hr" section />
                <Header as="h3" color="violet">
                  Comentários
                </Header>
                <CommentGroup as="section">
                  {post.comments.map((comment, commentKey) => (
                    <Comment key={commentKey}>
                      <CommentAvatar src={comment.author.image} />
                      <CommentContent>
                        <CommentAuthor>
                          {comment.author.username === post.author.username ? (
                            <Icon name="write" size="small" />
                          ) : null}
                          {comment.author.username}
                        </CommentAuthor>
                        <CommentMetadata>
                          {this.getDate(comment.date)} - {this.getHour(comment.date)}
                        </CommentMetadata>
                        <CommentText dangerouslySetInnerHTML={this.createMarkup(comment.text)} />
                      </CommentContent>
                    </Comment>
                  ))}
                </CommentGroup>
                {userIsLogged ? <Divider as="hr" section /> : null}
                {userIsLogged ? (
                  <Segment as="section">
                    <Header color="blue">Comentar</Header>
                    <Segment as={BlueInput}>
                      <TextEditorComponent
                        ref={this.setTextEditorComponentRef}
                        placeholder="Insira o seu comentário"
                      />
                    </Segment>
                    <AlignedInCenter>
                      <Button
                        color="blue"
                        icon
                        labelPosition="left"
                        id={postKey}
                        onClick={this.handleSendCommentButtonClick}
                      >
                        <Icon name="plus" />
                        Adicionar comentário
                      </Button>
                    </AlignedInCenter>
                  </Segment>
                ) : null}
              </Container>
            </Segment>
            {postKey === posts.length - 1 ? null : <Divider as={VerticallySpaced} />}
          </Container>
        ))}
      </PostsContainer>
    );
  }
}

const mapStateToProps = ({ posts, users }: ApplicationState) => ({
  posts: posts.data,
  users: users.data,
  loggedId: users.loggedId
});

const mapDispatchToProps = (dispatch: Dispatch<any>, { showAddPostModal }: OwnProps) => ({
  ...bindActionCreators({ add, edit }, dispatch),
  showAddPostModal
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PostsComponent);
