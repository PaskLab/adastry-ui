<script lang="ts">
	import Aside from '../landing/aside.svelte';
	import Footer from '../landing/footer.svelte';
</script>

<div class="d-flex flex-column flex-root">
	<div class="d-flex flex-column flex-lg-row flex-column-fluid">
		<Aside />

		<div class="d-flex flex-column flex-lg-row-fluid py-10 page-content">
			<div class="d-flex flex-center flex-column flex-column-fluid">
				<div class="px-10 px-lg-15 mx-auto text-gray-800">
					<h1 class="mb-4">Privacy Policy</h1>

					<h6 class="mb-8 text-gray-600">Last revision: Friday 11<sup>th</sup>, February 2022</h6>

					<p>
						Please read our privacy policy BEFORE using our website. This document describes the
						methods used on our platform to collect information as well as the use we could make of
						this information.
					</p>
					<p>
						If you do not agree with our privacy policy, you must refrain from using our site, as
						well as any materials and content derived from it. By accessing or using the website,
						you understand and agree to our privacy policy.
					</p>

					<h3>Section 1 - Anonymity</h3>

					<p>
						Users and members of our website may interact on it anonymously by using a nickname.
						However, there are situations where it is impossible to remain completely anonymous in
						order to ensure the proper functioning of the website. Any personal information to be
						provided by the user will never be shared with a third party without the user's
						authorization, except for the situations described in section 5.
					</p>

					<h3>Section 2 - Collection of Personal Information</h3>

					<ol>
						<li>
							The personal information we collect is obtained through forms and through the
							interactivity established between you and our website. It is possible that we collect
							personal information about our users in certain situations, such as:
						</li>
					</ol>
					<ol>
						<li>when creating an account on the website;</li>
						<li>when associating wallet accounts to your user;</li>
						<li>when using the contact form;</li>
						<li>when registering to notifications;</li>
						<li>when modifying account settings for members;</li>
					</ol>
					<ol>
						<li>The collected information may include :</li>
					</ol>
					<ol>
						<li>last name;</li>
						<li>name;</li>
						<li>email address;</li>
						<li>password;</li>
						<li>language;</li>
						<li>country currency;</li>
					</ol>

					<h3>Section 3 - Use of Personal Information</h3>

					<ol>
						<li>We may use the personal information we collect in the following situations :</li>
					</ol>
					<ol>
						<li>to confirm your email address;</li>
						<li>to create your personal account on our website;</li>
						<li>
							to display your informations on your profile page if you previously entered these
							informations in the profile settings;
						</li>
						<li>
							to assist you when recovering a forgotten password if you did provide an email
							address;
						</li>
						<li>to confirm your identity to ensure the security of your information;</li>
						<li>
							to notify you of novelties, changes or interactions on the website to the extent that
							we have received your consent to this effect;
						</li>
						<li>to advise you when a change will be made to our policies;</li>
						<li>to help you with technical issues with the website;</li>
						<li>to ensure that the content of our website is displayed as it should;</li>
						<li>to protect our legal interests.</li>
					</ol>
					<ol>
						<li>
							E-mails notifications sent automatically can be disabled on the user setting page.
						</li>
					</ol>

					<h3>Section 4 - Disclosure of your personal information</h3>

					<ol>
						<li>
							We will never share your personal information with any third party without your
							consent, except in the following situations:
						</li>
					</ol>
					<ol>
						<li>when we have your explicit consent to do so;</li>
						<li>
							when we can reasonably infer that you give your consent by the use of features on our
							website allowing you to access the services of a third party;
						</li>
						<li>
							when it is our duty under Canadian law to disclose your information in order to comply
							with legal obligations or to enforce our terms and conditions in order to protect the
							rights and security of Adastry and its users.
						</li>
					</ol>
					<ol>
						<li>
							In such circumstances, we will disclose only the minimum information required by the
							situation.
						</li>
					</ol>

					<h3>Section 5 - Security of Personal Information</h3>

					<ol>
						<li>
							The security of your personal information and our infrastructure is important to us.
							We are committed to implement all reasonable measures, within our means, to ensure it.
						</li>
						<li>
							High-sensitivity information, such as your password and email, will never be stored in
							plain text on our servers in order to avoid any indiscretions.
						</li>
					</ol>

					<h3>Section 6 - Usage of "cookies"</h3>

					<p>
						Our website and the third party services on our site may use "cookies". "Cookies" are
						small files saved on the user's hard disk, usually used to recognize the user when
						visiting the website. You can refuse to save these files on your system by modifying the
						settings of your browser, however these files are necessary for the proper functioning
						of our website.
					</p>

					<h3>Section 7 - Issues, concerns and right to be forgotten</h3>

					<p>
						You can address your questions and concerns, and to assert your right to be forgotten
						through our contact form.
					</p>

					<h3>Section 8 - Changes to Privacy Policy</h3>

					<ol>
						<li>
							We reserve the right to change our policies at any time. Subsequent documents will
							take precedence over previous versions.
						</li>
						<li>A notice will be sent 15 days before the change takes effect.</li>
						<li>
							In the event that you do not accept our new policies, you will always be free to stop
							using our services.
						</li>
					</ol>
				</div>
			</div>

			<Footer />
		</div>
	</div>
</div>

<style>
	.page-content {
		overflow-y: scroll;
	}
</style>
