from django.test import TestCase, Client

from modelchimp.factories.factory_user import UserFactory
from modelchimp.factories.factory_profile import ProfileFactory
from modelchimp.factories.factory_project import ProjectFactory
from modelchimp.factories.factory_membership import MembershipFactory
from modelchimp.factories.factory_experiment import ExperimentFactory


class BaseTest(TestCase):
    def setUp(self):
        self._data_setup()
        self.client = Client()
        self.login = self.client.login(username='admin@modelchimp.com', password='modelchimp123')

    def _data_setup(self):
        self.user = UserFactory(email='admin@modelchimp.com')
        self.profile = ProfileFactory(user=self.user)
        self.project = ProjectFactory(user=self.user)
        self.membership = MembershipFactory(user=self.user, project=self.project)
        self.experiment1 = ExperimentFactory(user=self.user, project=self.project)
        self.experiment2 = ExperimentFactory(user=self.user, project=self.project)
