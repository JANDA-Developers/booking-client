import React from 'react';
import { Mutation } from 'react-apollo';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Card from '../../../atoms/cards/Card';
import InputText from '../../../atoms/forms/inputText/InputText';
import Button from '../../../atoms/button/Button';
import './Login.scss';
import { LOG_USER_IN } from '../../../apollo/clientQueries';
import { EMAIL_SIGN_IN, GET_USER_INFO } from '../../../apollo/queries';
import { useInput, LANG, useModal } from '../../../hooks/hook';
import utils from '../../../utils/utils';
import { IContext } from '../../bookingHost/BookingHostRouter';
import client from '../../../apollo/apolloClient';
import PreloaderModal from '../../../atoms/preloaderModal/PreloaderModal';
import TextButton from '../../../atoms/textButton/TextButton';
import FindEmailModalWrap from '../../../components/findEmailModal/FindEmailModalWrap';
import PasswordChangeModalWrap from './PasswordChangeModalWrap';
import { onCompletedMessage } from '@janda-com/front/build/utils/utils';

interface Iprops {
	context: IContext;
}

const Login: React.FC<Iprops> = ({ context }) => {
	const { history } = context;
	const lastLoginEmail = localStorage.getItem('lastLogin') || '';
	const emailHook = useInput(lastLoginEmail, true);
	const passwordHook = useInput('', true);
	const ressetPasswordModalHook = useModal(false);
	const findPasswordModalHook = useModal(false);

	return (
		<div id="loginPage" className="container container--centerlize">
			<div>
			<h1>Login</h1>
				<Card>
					{/* 로그인 뮤테이션 (로컬 ) */}
					<Mutation
						client={client}
						mutation={LOG_USER_IN}
						awaitRefetchQueries
						refetchQueries={[ { query: GET_USER_INFO } ]}
						onCompleted={() => {
							history.replace('/dashboard');
						}}
					>
						{(logUserIn: any, { loading: loginMuLoading }: any) => {
							const emailSignIn = (e: any) => {
								if (loginMuLoading) return;

								e.preventDefault();
								if (!emailHook.isValid) {
									toast.warn(LANG('username_must_be_email'));
									return;
								}

								client
									.query({
										query: EMAIL_SIGN_IN,
										variables: {
											email: emailHook.value,
											password: passwordHook.value
										}
									})
									.then(({ data: { EmailSignIn: { ok, token, error } } }) => {
										if (ok) {
											if (token) {
												localStorage.setItem('lastLogin', emailHook.value);
												logUserIn({
													variables: {
														token
													}
												});
											}
										}
										if (error) {
											toast.warn(LANG('cant_find_this_email'));
										}
									});
							};

							return (
								<form onSubmit={emailSignIn}>
									<PreloaderModal loading={loginMuLoading} />
									<div>
										<InputText id="LoginEmail" {...emailHook} validation={utils.isEmail} label="Email" />
									</div>
									<div>
										<InputText id="LoginPassword" {...passwordHook} type="password" label="Password" />
									</div>
									<div>
										<div>
											<Button id="LoginBtn" type="submit" thema="primary" label={LANG('login')} />
											<Link id="linkToSingUp" to="/signUp">
												<Button thema="primary" label={LANG('signUp')} />
											</Link>
										</div>
									</div>
								</form>
							);
						}}
					</Mutation>
				</Card>

				<div>
					<TextButton
						onClick={() => {
							findPasswordModalHook.openModal();
						}}
						size="small"
					>
						{LANG('find_email')}
					</TextButton>
					<TextButton
						onClick={() => {
							ressetPasswordModalHook.openModal();
						}}
						size="small"
					>
						{LANG('password_resset')}
					</TextButton>
				</div>
			</div>
			<FindEmailModalWrap context={context} modalHook={findPasswordModalHook} />
			<PasswordChangeModalWrap modalHook={ressetPasswordModalHook} />
		</div>
	);
};

export default Login;
