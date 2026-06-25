import API from "../../api/axios";

const SendMail = async (data) => {
  const {candidate, type} = data;
  try {

    //console.log(data);

    const response = await API.post(
      '/send', 
      {
        name: candidate.name,
        email: candidate.email,
        date: candidate.date,
        time:candidate.time,
        interviewer: candidate.interviewer,
        interviewType: candidate.interviewType,
        roomId: candidate.roomId,
        type: type
      }
    );

   // alert('Email Sent Successfully');

    return response.data;

  } catch (error) {

    console.log(error);

    alert('Failed To Send Email');
  }
};

export default SendMail;