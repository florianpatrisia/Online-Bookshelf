import { useNavigate } from 'react-router-dom'
import './LoginPage.css'
import '../../utils/reset.css'
export function LoginPage() {
    const navigate = useNavigate()
    function submitHandler() {}
    return (
        <>
            <form onSubmit={submitHandler} name="register-form-login">
                <fieldset className="form-register-login">
                    <legend className="legend">Sign In</legend>
                    <div>
                        <input
                            type="text"
                            placeholder="Email"
                            name="email"
                            className="input-email"
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder="Password"
                            name="password"
                            className="input-password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn-create"
                        onClick={() => navigate('/')}
                    >
                        Done
                    </button>
                </fieldset>
            </form>
        </>
    )
}
