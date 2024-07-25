import { mount } from '@vue/test-utils';
import LoginNew from '../../views/authentication/LoginNew.vue';
import { useAuthStore } from '../../stores/auth';
import { useRouter } from 'vue-router';

jest.mock('@/stores/auth');
jest.mock('vue-router');

describe('LoginNew.vue', () => {
    let wrapper;
    let authStoreMock;
    let routerMock;

    beforeEach(() => {
        authStoreMock = {
            login: jest.fn()
        };
        useAuthStore.mockReturnValue(authStoreMock);

        routerMock = {
            push: jest.fn()
        };
        useRouter.mockReturnValue(routerMock);

        wrapper = mount(LoginNew);
    });

    it('renders the login form', () => {
        expect(wrapper.find('h2').text()).toBe('Se connecter');
    });

    it('displays validation errors for empty fields', async () => {
        await wrapper.find('form').trigger('submit.prevent');
        expect(wrapper.find('#email').classes()).toContain('border-red-500');
        expect(wrapper.find('#password').classes()).toContain('border-red-500');
    });

    it('calls login method on valid form submission', async () => {
        wrapper.vm.formData.email = 'test@example.com';
        wrapper.vm.formData.password = 'password123';
        authStoreMock.login.mockResolvedValue(null);

        await wrapper.find('form').trigger('submit.prevent');

        expect(authStoreMock.login).toHaveBeenCalledWith({
            email: 'test@example.com',
            password: 'password123'
        });
        expect(routerMock.push).toHaveBeenCalledWith('/');
    });

    it('displays server error on login failure', async () => {
        wrapper.vm.formData.email = 'test@example.com';
        wrapper.vm.formData.password = 'password123';
        authStoreMock.login.mockResolvedValue('Invalid credentials');

        await wrapper.find('form').trigger('submit.prevent');

        expect(wrapper.find('.text-red-600').text()).toBe('Invalid credentials');
    });

    it('clears email error on input', async () => {
        wrapper.vm.errors.email = 'Email obligatoire';
        wrapper.vm.touched.email = true;

        await wrapper.find('#email').setValue('test@example.com');

        expect(wrapper.vm.errors.email).toBe(null);
    });

    it('clears password error on input', async () => {
        wrapper.vm.errors.password = 'Le mot de passe doit contenir au moins 12 caractères';
        wrapper.vm.touched.password = true;

        await wrapper.find('#password').setValue('password123');

        expect(wrapper.vm.errors.password).toBe(null);
    });
});
