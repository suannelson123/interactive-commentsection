import { useEffect, useRef, useState } from "react";
import data, { iconDelete, iconEdit, iconMinus, iconPlus, iconReply } from "../constant";

const dataItem = () => {
  return data;
};


const CommentSection = () => {

  const [itemData] = useState(() => dataItem());
  const { currentUser } = itemData[0];
  const [openModal, setOpenModal] = useState(false);
  const [sampleData, setSampleData] = useState(data[0].comments);

  const [deleteThisComment, setDeleteThisComment] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isEditingCommentId, setisEditingCommentId] = useState(null);

  const [isReplying, setIsReplying] = useState(null);
  const [isReplyingId, setisReplyingId] = useState(null);

  const buttonRef = useRef(null);
  const inputRef = useRef(null);

  const replyInputRef = useRef(null);
  const replyButton = useRef(null);
  const changeScoreComment = (id, increment) => {
    const updatedScore = sampleData.map(prev => {
      if (prev.id === id && increment) {
        return {
          ...prev, score: prev.score + (1)
        };
      } else if (prev.id === id && !increment) {
        return {
          ...prev, score: prev.score - (prev.score > 0 ? 1 : 0)
        };
      }
      return prev;

    });
    setSampleData(updatedScore);
  };

  const changeScoreReply = (id, increment) => {
    const updatedSCoreReply = sampleData.map(item => {
      return {
        ...item,
        replies: item.replies.map(item => {
          if (item.id === id && increment) {
            return {
              ...item, score: item.score + (1)
            };
          } else if (item.id === id && !increment) {
            return {
              ...item, score: item.score - (item.score > 0 ? 1 : 0)
            };
          } else if (item.id !== id) {
            item.replies?.map(item => {
              if (item.id === id && increment) {
                return {
                  ...item, score: item.score += 1
                };
              } else if (item.id === id && !increment) {
                return {
                  ...item, score: item.score -= (item.score > 0 ? 1 : 0)
                };
              }
              return item;
            });
          }
          return item;
        })
      };
    });

    setSampleData(updatedSCoreReply);
  };

  const isDeleteEditComment = (id, isDelete, isEdit, contentInput) => {

    if (id && isEdit === 'EditComment') {
      const editedComment = sampleData.map(item => {
        if (item.id === id) {
          return { ...item, content: contentInput.value };
        } else {
          return {
            ...item,
            replies: item.replies.map(reply => {
              if (reply.id === id) {
                return { ...reply, content: contentInput.value };
              } else {
                return {
                  ...reply,
                  replies: reply.replies?.map(nestedReply => {
                    if (nestedReply.id === id) {
                      return { ...nestedReply, content: contentInput.value };
                    }
                    return nestedReply;
                  }) || []
                };
              }
            })
          };
        }
      });

      setSampleData(editedComment);
      setIsEditing(false);
      contentInput.value = '';
    }


    if (id && isDelete === 'DeleteThisReply') {
      const newUpdatedRepliesReply = sampleData.map(item => {
        if (item.id !== id) {
          return {
            ...item, replies: item.replies.filter(item => item.id !== id)
          };
        }
        return item;
      });
      setSampleData(newUpdatedRepliesReply);
    }

    if (id && isDelete === 'DeleteNestedReply') {
      const newUpdatedRepliesReply = sampleData.map(item => {

        const updatedReplies = item.replies.map(innerItem => {
          const filteredReplies = innerItem.replies?.filter(reply => reply.id !== id);

          return filteredReplies === innerItem.replies
            ? innerItem
            : { ...innerItem, replies: filteredReplies };
        });

        return updatedReplies === item.replies
          ? item
          : { ...item, replies: updatedReplies };
      });
      setSampleData(newUpdatedRepliesReply);
    }


    if (isDelete === 'DeleteComment') {
      const updatedRemovedComment = sampleData.filter(item => item.id !== id);
      setSampleData(updatedRemovedComment);
    }


  };

  const popUp = () => {
    // aint gonna lie im too lazy to add scroll lock when the popups open but i know how to. its already prepared in the package.json dependencies xD
    setOpenModal(true);
  };


  useEffect(() => {
    const handleEvent = (e) => {
      if (e.key === 'Enter' && inputRef.current.value !== '') {
        buttonRef.current.click();
      } else if (e.key === 'Enter' && replyInputRef.current.value !== '') {
        replyButton.current.click();
      }
    };
    window.addEventListener('keyup', handleEvent);

    return () => window.removeEventListener('keyup', handleEvent);
  }, []);

  const Reply = ({ id, username }, contentInput) => {
    const ReplyTo = {
      "id": (Date.now() / 1000),
      "content": contentInput.value,
      "createdAt": "just now",
      "score": 4,
      "replyingTo": username,
      "banner": 'you',
      "user": {
        "image": {
          "png": currentUser.image.png,
          "webp": currentUser.image.webp
        },
        "username": currentUser.username,
      }
    };

    const updatedCommentReply = sampleData.map(item => {
      if (item.id === id) {
        return {
          ...item, replies: [...item.replies, ReplyTo]
        };
      } else if (item.id !== id) {
        return {
          ...item, replies: item.replies.map(item => {
            if (item.id === id) {
              return {
                ...item, replies: [...item.replies, ReplyTo]
              };
            }
            return item;
          })
        };
      }
      return item;
    });
    setSampleData(updatedCommentReply);

  };

  console.log(sampleData);

  const Comment = ({ comment }) => {
    const {
      id,
      content,
      createdAt,
      score,
      user,
      replies,
      banner
    } = comment;
    return (
      <>
        {/* modal */}
        <div className={`${openModal ? 'flex ' : 'hidden'} fixed top-0 left-0 w-full h-full bg-color-overlay z-1 items-center justify-center`}>

          <div className="w-11/12 max-w-3xl bg-color-white p-5 py-11 rounded-lg">
            <h1 className="text-color-darkBlue text-[1.5rem] font-bold">Delete comment</h1>
            <div>
              <p className="text-color-grayBlue my-7 font-semibold text-[1.1rem]">Are you sure you want to delete this comment? This will remove the comment and can&apos;t be undone</p>
            </div>
            <div className="flex gap-3 font-bold">
              <button onClick={() => {
                isDeleteEditComment(deleteThisComment, false);
                setOpenModal(false);
              }} className="bg-color-darkBlue w-[50%] min-h-[50px] rounded-lg hover:bg-color-lightGrayBlue transition-all">
                NO, CANCEL
              </button>
              <button onClick={() => {
                isDeleteEditComment(deleteThisComment, 'DeleteComment');
                setOpenModal(false);
              }} className="bg-color-softRed w-[50%] min-h-[50px] rounded-lg hover:bg-color-lightGrayBlue transition-all">
                YES, DELETE
              </button>
            </div>
          </div>
        </div>

        <section className='bg-color-white text-color-darkBlue mb-[2rem] p-[2rem] rounded-[1rem] flex flex-col'>

          <div>
            <div id={id} className="flex items-center gap-3">
              <img className="object-contain w-10" src={user.image.png} alt={user.username} />
              <h2 className="font-bold">{user.username}</h2>
              {banner && <span className="bg-color-moderBlue text-white px-2">{banner}</span>}
              <span className="text-color-grayBlue">{createdAt}</span>
            </div>

            <div className="my-5">
              <p className="text-color-grayBlue ">{content}</p>
            </div>

            <div className="flex">
              <div className=" flex-1">

                <div className="flex  bg-color-lightGray px-3 py-2 rounded-lg w-max">
                  <button onClick={() => changeScoreComment(id, true)} className="p-1">
                    <img src={iconPlus} alt="plus" />
                  </button>
                  <span className="mx-4">{score}</span>
                  <button onClick={() => changeScoreComment(id, false)} className="p-1">
                    <img src={iconMinus} alt="minus" />
                  </button>

                </div>
              </div>

              {banner ? (
                <div className="flex gap-5">

                  <div onClick={() => {
                    setDeleteThisComment(id);
                    popUp();
                  }} className="flex items-center gap-2 cursor-pointer hover:opacity-[0.5] transition-all">
                    <img className="object-contain w-[16px]" src={iconDelete} alt="iconDelete" />
                    <span>Delete</span>
                  </div>
                  <div onClick={() => {
                    setIsEditing(!isEditing);
                    setisEditingCommentId(id);
                    inputRef.current.focus();
                    if (!isEditing) {
                      inputRef.current.value = content;
                    } else {
                      inputRef.current.value = '';
                    }
                  }} className="flex items-center gap-2 cursor-pointer hover:opacity-[0.5] transition-all">
                    <img className="object-contain w-[16px] " src={iconEdit} alt="iconEdit" />
                    <span>Edit</span>
                  </div>

                </div>
              ) : (
                <div onClick={() => {
                  setisReplyingId({
                    "id": id,
                    "username": user.username,
                  });
                  setIsReplying(!isReplying);
                }} className="flex flex-1 justify-end gap-2 hover:opacity-[0.5] transition-all">
                  <img className="object-contain w-[20px] " src={iconReply} alt="reply-icon" />,
                  <button className="font-semibold">Reply</button>
                </div>
              )

              }
            </div>
          </div>
        </section>

        <section>
          {replies.length > 0 &&
            <div className="border-l-2 border-color-lightGrayBlue p-2 rounded-md">
              {
                replies.map(({ id, content, createdAt, score, user, replyingTo, banner, replies }, index) => (

                  <div key={index}>
                    <div>
                      <section className='bg-color-white text-color-darkBlue mb-[2rem] p-[2rem] rounded-[1rem] flex flex-col'>

                        <div id={id} className="flex items-center gap-5">
                          <img className="object-contain w-10" src={user.image.png} alt={user.username} />
                          <h2 className="font-bold">{user.username}</h2>
                          {banner && <span className="bg-color-moderBlue text-white px-2">{banner}</span>}
                          <span className="text-color-grayBlue">{createdAt}</span>
                        </div>

                        <div className="my-5">
                          <p className="text-color-grayBlue ">{replyingTo && <span className="font-bold text-color-moderBlue mr-1">@{replyingTo},</span>}{content}</p>
                        </div>

                        <div className="flex">
                          <div className=" flex-1">

                            <div className="flex  bg-color-lightGray px-3 py-2 rounded-lg w-max">
                              <button onClick={() => changeScoreReply(id, true)} className="p-1">
                                <img src={iconPlus} alt="plus" />
                              </button>
                              <span className="mx-4">{score}</span>
                              <button onClick={() => changeScoreReply(id, false)} className="p-1">
                                <img src={iconMinus} alt="minus" />
                              </button>

                            </div>
                          </div>

                          <div className="flex flex-1 justify-end gap-2 ">
                            {banner ? (
                              <div className="flex gap-5">

                                <div onClick={() => isDeleteEditComment(id, 'DeleteThisReply')} className="flex items-center gap-2 cursor-pointer hover:opacity-[0.5] transition-all">
                                  <img className="object-contain w-[16px]" src={iconDelete} alt="iconDelete" />
                                  <span>Delete</span>
                                </div>
                                <div onClick={() => {
                                  setIsEditing(!isEditing);
                                  setisEditingCommentId(id);
                                  inputRef.current.focus();
                                  if (!isEditing) {
                                    inputRef.current.value = content;
                                  } else {
                                    inputRef.current.value = '';
                                  }
                                }} className="flex items-center gap-2 cursor-pointer hover:opacity-[0.5] transition-all">
                                  <img className="object-contain w-[16px]" src={iconEdit} alt="iconEdit" />
                                  <span>Edit</span>
                                </div>

                              </div>
                            ) : (
                              <div onClick={() => {
                                setisReplyingId({
                                  "id": id,
                                  "username": user.username,
                                });
                                setIsReplying(!isReplying);
                              }} className="flex flex-1 justify-end gap-2 hover:opacity-[0.5] transition-all">
                                <img className="object-contain w-[20px]" src={iconReply} alt="reply-icon" />,
                                <button className="font-semibold">Reply</button>
                              </div>
                            )}
                          </div>
                        </div>
                      </section>
                      <div>
                      </div>
                    </div>
                    {replies?.length > 0 &&
                      replies.map(({ id, content, createdAt, score, user, replyingTo, banner, }, index) => (
                        <section key={index} className='bg-color-white text-color-darkBlue mb-[2rem] p-[2rem] rounded-[1rem] flex flex-col'>

                          <div id={id} className="flex items-center gap-5">
                            <img className="object-contain w-10" src={user.image.png} alt={user.username} />
                            <h2 className="font-bold">{user.username}</h2>
                            {banner && <span className="bg-color-moderBlue text-white px-2">{banner}</span>}
                            <span className="text-color-grayBlue">{createdAt}</span>
                          </div>

                          <div className="my-5">
                            <p className="text-color-grayBlue ">{replyingTo && <span className="font-bold text-color-moderBlue mr-1">@{replyingTo},</span>}{content}</p>
                          </div>

                          <div className="flex">
                            <div className=" flex-1">

                              <div className="flex  bg-color-lightGray px-3 py-2 rounded-lg w-max">
                                <button onClick={() => changeScoreReply(id, true)} className="p-1">
                                  <img src={iconPlus} alt="plus" />
                                </button>
                                <span className="mx-4">{score}</span>
                                <button onClick={() => changeScoreReply(id, false)} className="p-1">
                                  <img src={iconMinus} alt="minus" />
                                </button>

                              </div>
                            </div>

                            <div className="flex flex-1 justify-end gap-2 ">
                              {banner && (
                                <div className="flex gap-5">

                                  <div onClick={() => isDeleteEditComment(id, 'DeleteNestedReply')} className="flex items-center gap-2 cursor-pointer hover:opacity-[0.5] transition-all">
                                    <img className="object-contain w-[16px]" src={iconDelete} alt="iconDelete" />
                                    <span>Delete</span>
                                  </div>
                                  <div onClick={() => {
                                    setIsEditing(!isEditing);
                                    setisEditingCommentId(id);
                                    inputRef.current.focus();
                                    if (!isEditing) {
                                      inputRef.current.value = content;
                                    } else {
                                      inputRef.current.value = '';
                                    }
                                  }} className="flex items-center gap-2 cursor-pointer hover:opacity-[0.5] transition-all">
                                    <img className="object-contain w-[16px]" src={iconEdit} alt="iconEdit" />
                                    <span>Edit</span>
                                  </div>

                                </div>
                              )}
                            </div>
                          </div>
                        </section>
                      ))
                    }
                  </div>
                ))
              }
            </div>
          }
        </section>
      </>
    );
  };



  const sendComment = (input) => {
    if (!input.value.trim()) return;
    const sendNewComment = {
      "id": (Date.now() / 1000),
      "content": input.value,
      "createdAt": "just now",
      "score": 0,
      "user": {
        "image": {
          "png": currentUser.image.png,
          "webp": currentUser.image.webp,
        },
        "username": currentUser.username,
      },
      "replies": [],
      "banner": 'you'
    };

    setSampleData(prev => (
      [...prev, sendNewComment]
    ));
    input.value = '';
  };
  return (
    <div className="relative">
      {/*  comment section*/}
      {
        sampleData.map(comment => (
          <Comment key={comment.id} comment={comment} />
        ))
      }

      {/* input section */}

      {isEditing ?
        (
          <div className={`${isReplying ? "hidden" : 'flex'} w-[90%] max-w-4xl left-[50%] translate-x-[-50%] flex-col gap-5 fixed bottom-0  p-5 bg-color-white rounded-lg`}>

            <input id="edit" ref={inputRef} className="text-color-darkBlue bg-color-white border border-color-darkBlue w-full h-[2rem] p-5 text-wrap" placeholder="Edit Comment..." type="text" />

            <div className="flex items-center">
              <img className="w-[3rem]" src={currentUser.image.png} alt={currentUser.username} />
              <button ref={buttonRef} onClick={() => isDeleteEditComment(isEditingCommentId, false, 'EditComment', inputRef.current)} className=" bg-color-moderBlue py-3 rounded-md px-8 ml-auto hover:bg-color-lightGrayBlue transition-all">Update</button>
            </div>
          </div>
        ) :
        (
          <div className={`${isReplying ? "hidden" : 'flex'} max-w-4xl w-[90%] left-[50%] translate-x-[-50%]  flex-col gap-5 fixed bottom-0  p-5 bg-color-white rounded-lg`}>

            <input id="send" ref={inputRef} className="text-color-darkBlue bg-color-white border border-color-darkBlue w-full h-[2rem] p-5 text-wrap" placeholder="Add comment.." type="text" />

            <div className="flex items-center">
              <img className="w-[3rem]" src={currentUser.image.png} alt={currentUser.username} />
              <button ref={buttonRef} onClick={() => sendComment(inputRef.current)} className=" bg-color-moderBlue py-3 rounded-md px-8 ml-auto hover:bg-color-lightGrayBlue transition-all">Send</button>
            </div>
          </div>
        )
      }


      <div className={`${isReplying ? "flex" : "hidden"} max-w-4xl w-[90%] left-[50%] translate-x-[-50%]  flex-col gap-5 fixed bottom-0  p-5 bg-color-white rounded-lg`}>

        <input id='replyInput' ref={replyInputRef} className="text-color-darkBlue bg-color-white border border-color-darkBlue w-full h-[2rem] p-5 text-wrap" placeholder="Add Reply..." type="text" />

        <div className="flex items-center">
          <img className="w-[3rem]" src={currentUser.image.png} alt={currentUser.username} />
          <button ref={replyButton} onClick={() => {
            Reply(isReplyingId, replyInputRef.current);
            replyInputRef.current.value = '';
            setIsReplying(false);
          }} className=" bg-color-moderBlue py-3 rounded-md px-8 ml-auto hover:bg-color-lightGrayBlue transition-all">Reply</button>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
