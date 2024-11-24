import { useNavigate } from 'react-router-dom'
import './RegisterPage.css'
import '../../utils/reset.css'
export function RegisterPage() {
    const navigate = useNavigate()
    function submitHandler() {}
    return (
        <>
            <form onSubmit={submitHandler} name="register-form">
                <fieldset className="form-register">
                    <legend className="legend">Create a new account</legend>
                    <div>
                        <input
                            type="text"
                            placeholder="Username"
                            name="username"
                            className="input-username"
                            required
                        />
                    </div>
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
